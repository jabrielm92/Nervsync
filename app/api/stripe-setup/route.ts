import { NextRequest, NextResponse } from "next/server"
import { ensureStripeProducts } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  try {
    const priceIds = await ensureStripeProducts()

    return NextResponse.json({
      success: true,
      priceIds,
    })
  } catch (error) {
    console.error("Stripe setup error:", error)
    return NextResponse.json(
      { error: "Failed to set up Stripe products" },
      { status: 500 }
    )
  }
}
