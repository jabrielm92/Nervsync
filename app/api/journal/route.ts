import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { analyzeJournalEntry } from "@/lib/claude-journal"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") ?? "30", 10)

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Journal GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, prompt } = body

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Create the journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        content,
        prompt: prompt ?? null,
      },
    })

    // Get the user's latest checkin state for journal analysis context
    const latestCheckin = await prisma.checkin.findFirst({
      where: { userId },
      orderBy: { checkedInAt: "desc" },
      select: { primaryState: true },
    })
    const linkedState = latestCheckin?.primaryState ?? "ventral_vagal"

    // Analyze with AI in the background (don't block response if it fails)
    try {
      const analysis = await analyzeJournalEntry(content, linkedState, prompt)

      await prisma.journalEntry.update({
        where: { id: entry.id },
        data: {
          aiReflection: analysis.reflection,
          tags: analysis.tags,
          emotionalTone: analysis.emotionalTone,
        },
      })

      // Award 15 XP for journaling
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 15 } },
      })

      const updatedEntry = await prisma.journalEntry.findUnique({
        where: { id: entry.id },
      })

      return NextResponse.json(updatedEntry, { status: 201 })
    } catch (aiError) {
      console.error("Journal AI analysis failed:", aiError)

      // Still award XP even if AI fails
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 15 } },
      })

      return NextResponse.json(entry, { status: 201 })
    }
  } catch (error) {
    console.error("Journal POST error:", error)
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    )
  }
}
