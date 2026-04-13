import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        preferredDuration: true,
        wakeTime: true,
        bedTime: true,
        primaryGoal: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        onboardingComplete: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, primaryGoal, preferredDuration, wakeTime, bedTime, timezone } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        primaryGoal: primaryGoal || undefined,
        preferredDuration: preferredDuration ? Number(preferredDuration) : undefined,
        wakeTime: wakeTime || undefined,
        bedTime: bedTime || undefined,
        timezone: timezone || undefined,
        onboardingComplete: true,
      },
    })

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    )
  }
}
