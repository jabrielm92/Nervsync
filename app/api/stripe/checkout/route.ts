import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan } = body

    if (!plan || !["monthly", "annual", "lifetime"].includes(plan)) {
      return NextResponse.json(
        { error: "Valid plan is required: monthly, annual, or lifetime" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const checkoutSession = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      plan: plan as "monthly" | "annual" | "lifetime",
      stripeCustomerId: user.stripeCustomerId ?? undefined,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
