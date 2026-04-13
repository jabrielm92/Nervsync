import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const SOS_PROTOCOL = {
  title: "SOS Emergency Regulation",
  description:
    "A rapid nervous system reset combining physiological sigh and 5-4-3-2-1 grounding to bring you back to safety quickly.",
  durationMinutes: 5,
  targetState: "ventral_vagal",
  exercises: [
    {
      name: "Physiological Sigh",
      category: "breathwork",
      description:
        "The fastest evidence-based way to calm your nervous system. A double inhale followed by an extended exhale.",
      instructions: [
        "Take a quick inhale through your nose.",
        "Immediately take a second, shorter inhale on top of the first (filling your lungs completely).",
        "Slowly exhale all the air out through your mouth, making it as long as possible.",
        "Repeat this pattern 3-5 times.",
        "Notice your heart rate beginning to slow.",
      ],
      durationSeconds: 60,
      breathCues: {
        inhale: 3,
        hold: 1,
        exhale: 6,
        pattern: "Double inhale + extended exhale (physiological sigh)",
      },
      order: 1,
    },
    {
      name: "5-4-3-2-1 Grounding",
      category: "grounding",
      description:
        "Engage all five senses to anchor yourself in the present moment and interrupt the stress response.",
      instructions: [
        "Look around and name 5 things you can SEE. Say them aloud or silently.",
        "Notice 4 things you can TOUCH. Reach out and feel their texture.",
        "Listen for 3 things you can HEAR. Even subtle sounds count.",
        "Identify 2 things you can SMELL. Breathe in deeply.",
        "Notice 1 thing you can TASTE. Even the taste in your mouth right now.",
        "Take a deep breath and notice how you feel now compared to when you started.",
      ],
      durationSeconds: 120,
      order: 2,
    },
    {
      name: "Settling Breath",
      category: "breathwork",
      description:
        "Close with slow, even breathing to sustain the shift toward regulation.",
      instructions: [
        "Breathe in gently through your nose for 4 seconds.",
        "Breathe out slowly through your mouth for 6 seconds.",
        "Continue this pattern for 5 rounds.",
        "Let your shoulders drop with each exhale.",
        "Rest in the stillness when complete.",
      ],
      durationSeconds: 60,
      breathCues: {
        inhale: 4,
        exhale: 6,
        pattern: "4-in, 6-out calming breath",
      },
      order: 3,
    },
  ],
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Create SOS session with pre-built protocol
    const sosSession = await prisma.session.create({
      data: {
        userId,
        title: SOS_PROTOCOL.title,
        description: SOS_PROTOCOL.description,
        durationMinutes: SOS_PROTOCOL.durationMinutes,
        targetState: SOS_PROTOCOL.targetState,
        sessionType: "sos",
        exercises: SOS_PROTOCOL.exercises as unknown as Record<string, unknown>[],
        startedAt: new Date(),
      },
    })

    // Award 15 XP for starting SOS session
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 15 } },
    })

    return NextResponse.json(
      { session: sosSession, xpAwarded: 15 },
      { status: 201 }
    )
  } catch (error) {
    console.error("SOS POST error:", error)
    return NextResponse.json(
      { error: "Failed to create SOS session" },
      { status: 500 }
    )
  }
}
