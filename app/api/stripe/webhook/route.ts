import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        const userId = checkoutSession.metadata?.userId
        const plan = checkoutSession.metadata?.plan

        if (!userId) {
          console.error("No userId in checkout session metadata")
          break
        }

        const updateData: Record<string, unknown> = {
          stripeCustomerId: checkoutSession.customer as string,
        }

        if (checkoutSession.mode === "subscription") {
          updateData.subscriptionId = checkoutSession.subscription as string
          updateData.subscriptionStatus = "active"
          updateData.subscriptionPlan = plan ?? "monthly"
        } else if (checkoutSession.mode === "payment") {
          // Lifetime purchase
          updateData.subscriptionStatus = "active"
          updateData.subscriptionPlan = "lifetime"
        }

        await prisma.user.update({
          where: { id: userId },
          data: updateData,
        })
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "canceled",
            },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "past_due",
            },
          })
        }
        break
      }

      default:
        // Unhandled event type - log and acknowledge
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
