import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCoachContext, COACH_SYSTEM_PROMPT, buildCoachMessages } from "@/lib/claude-coach"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Check daily message limit (30 messages/day)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayMessageCount = await prisma.coachMessage.count({
      where: {
        userId,
        role: "user",
        createdAt: { gte: todayStart },
      },
    })

    if (todayMessageCount >= 30) {
      return NextResponse.json(
        { error: "Daily message limit reached. You can send up to 30 messages per day." },
        { status: 429 }
      )
    }

    // Get user context for personalization
    const coachContext = await getCoachContext(userId)

    // Get last 20 messages for conversation history
    const recentMessages = await prisma.coachMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 20,
      select: { role: true, content: true },
    })

    // Save user message to DB
    await prisma.coachMessage.create({
      data: {
        userId,
        role: "user",
        content: message,
      },
    })

    // Build conversation with context
    const conversationHistory = [
      ...recentMessages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ]

    const messages = buildCoachMessages(coachContext, conversationHistory)

    // Stream response from Claude
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: COACH_SYSTEM_PROMPT,
      messages,
    })

    let fullResponse = ""

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text
              fullResponse += text
              controller.enqueue(new TextEncoder().encode(text))
            }
          }

          // Save assistant response to DB after streaming completes
          await prisma.coachMessage.create({
            data: {
              userId,
              role: "assistant",
              content: fullResponse,
            },
          })

          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Coach POST error:", error)
    return NextResponse.json(
      { error: "Failed to process coach message" },
      { status: 500 }
    )
  }
}
