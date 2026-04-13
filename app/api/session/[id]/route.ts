import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const regulationSession = await prisma.session.findUnique({
      where: { id },
      include: {
        checkin: true,
      },
    })

    if (!regulationSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Verify ownership
    if (regulationSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(regulationSession)
  } catch (error) {
    console.error("Session GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}
