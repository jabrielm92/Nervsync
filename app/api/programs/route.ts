import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all programs with user's enrollment status
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        enrollments: {
          where: { userId },
          select: {
            id: true,
            status: true,
            currentDay: true,
            completedDays: true,
            startedAt: true,
            completedAt: true,
          },
        },
      },
    })

    // Transform to include enrollment info directly
    const result = programs.map((program: typeof programs[number]) => ({
      ...program,
      enrollment: program.enrollments[0] ?? null,
      enrollments: undefined,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Programs GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch programs" },
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
    const { programId } = body

    if (!programId) {
      return NextResponse.json(
        { error: "programId is required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Check the program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
    })

    if (!program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      )
    }

    // Check user isn't already enrolled in an active program
    const activeEnrollment = await prisma.programEnrollment.findFirst({
      where: {
        userId,
        status: "active",
      },
      include: { program: { select: { name: true } } },
    })

    if (activeEnrollment) {
      return NextResponse.json(
        {
          error: `You are already enrolled in an active program: ${activeEnrollment.program.name}. Complete or leave it before enrolling in a new one.`,
        },
        { status: 409 }
      )
    }

    // Create enrollment
    const enrollment = await prisma.programEnrollment.create({
      data: {
        userId,
        programId,
        currentDay: 1,
        completedDays: [],
        status: "active",
      },
      include: { program: true },
    })

    // Increment program enrollment count
    await prisma.program.update({
      where: { id: programId },
      data: { enrollmentCount: { increment: 1 } },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Programs POST error:", error)
    return NextResponse.json(
      { error: "Failed to enroll in program" },
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
    const { enrollmentId, completedDay } = body

    if (!enrollmentId || completedDay === undefined) {
      return NextResponse.json(
        { error: "enrollmentId and completedDay are required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Fetch enrollment and verify ownership
    const enrollment = await prisma.programEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { program: true },
    })

    if (!enrollment || enrollment.userId !== userId) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      )
    }

    if (enrollment.status !== "active") {
      return NextResponse.json(
        { error: "Enrollment is not active" },
        { status: 400 }
      )
    }

    // Add day to completedDays if not already present
    const completedDays = enrollment.completedDays.includes(completedDay)
      ? enrollment.completedDays
      : [...enrollment.completedDays, completedDay]

    // Determine total days in program from modules
    const modules = enrollment.program.modules as Array<{ days?: number[] }>
    let totalDays = 0
    if (Array.isArray(modules)) {
      for (const mod of modules) {
        if (Array.isArray(mod.days)) {
          totalDays += mod.days.length
        }
      }
    }
    // Fallback: use durationWeeks * 7 if modules don't specify days
    if (totalDays === 0) {
      totalDays = enrollment.program.durationWeeks * 7
    }

    const allCompleted = completedDays.length >= totalDays
    const newCurrentDay = Math.max(...completedDays, enrollment.currentDay) + (allCompleted ? 0 : 1)

    const updatedEnrollment = await prisma.programEnrollment.update({
      where: { id: enrollmentId },
      data: {
        completedDays,
        currentDay: allCompleted ? Math.max(...completedDays) : newCurrentDay,
        status: allCompleted ? "completed" : "active",
        completedAt: allCompleted ? new Date() : undefined,
      },
      include: { program: true },
    })

    // Award 20 XP for completing a day
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 20 } },
    })

    return NextResponse.json({
      enrollment: updatedEnrollment,
      xpAwarded: 20,
      programCompleted: allCompleted,
    })
  } catch (error) {
    console.error("Programs PATCH error:", error)
    return NextResponse.json(
      { error: "Failed to update program progress" },
      { status: 500 }
    )
  }
}
