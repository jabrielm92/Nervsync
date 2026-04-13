import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-expect-error - apiVersion may differ across Stripe SDK versions
  apiVersion: "2024-12-18.acacia",
})

interface ProductConfig {
  name: string
  description: string
  priceAmount: number
  interval?: "month" | "year"
  mode: "subscription" | "payment"
}

const PRODUCTS: Record<string, ProductConfig> = {
  monthly: {
    name: "NervSync Pro Monthly",
    description: "Full access to NervSync nervous system regulation tools, billed monthly.",
    priceAmount: 1499,
    interval: "month",
    mode: "subscription",
  },
  annual: {
    name: "NervSync Pro Annual",
    description: "Full access to NervSync nervous system regulation tools, billed annually.",
    priceAmount: 9900,
    interval: "year",
    mode: "subscription",
  },
  lifetime: {
    name: "NervSync Pro Lifetime",
    description: "Lifetime access to NervSync nervous system regulation tools.",
    priceAmount: 19900,
    mode: "payment",
  },
}

// Cache resolved price IDs so we only look them up once per process
const priceIdCache: Record<string, string> = {}

export async function ensureStripeProducts(): Promise<Record<string, string>> {
  // Return cache if fully populated
  if (
    priceIdCache.monthly &&
    priceIdCache.annual &&
    priceIdCache.lifetime
  ) {
    return { ...priceIdCache }
  }

  for (const [plan, config] of Object.entries(PRODUCTS)) {
    if (priceIdCache[plan]) continue

    // Search for existing product by metadata
    const existingProducts = await stripe.products.search({
      query: `metadata["app"]:"nervsync" AND metadata["plan"]:"${plan}"`,
    })

    let productId: string

    if (existingProducts.data.length > 0) {
      productId = existingProducts.data[0].id

      // Find the active price for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 1,
      })

      if (prices.data.length > 0) {
        priceIdCache[plan] = prices.data[0].id
        continue
      }
    } else {
      // Create the product
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: {
          app: "nervsync",
          plan,
        },
      })
      productId = product.id
    }

    // Create the price
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: config.priceAmount,
      currency: "usd",
      metadata: {
        app: "nervsync",
        plan,
      },
    }

    if (config.interval) {
      priceData.recurring = { interval: config.interval }
    }

    const price = await stripe.prices.create(priceData)
    priceIdCache[plan] = price.id
  }

  return { ...priceIdCache }
}

export async function createCheckoutSession({
  userId,
  email,
  plan,
  stripeCustomerId,
}: {
  userId: string
  email: string
  plan: "monthly" | "annual" | "lifetime"
  stripeCustomerId?: string
}): Promise<Stripe.Checkout.Session> {
  const priceIds = await ensureStripeProducts()
  const priceId = priceIds[plan]
  const config = PRODUCTS[plan]

  const params: Record<string, unknown> = {
    mode: config.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
    metadata: {
      userId,
      plan,
    },
  }

  if (stripeCustomerId) {
    params.customer = stripeCustomerId
  } else {
    params.customer_email = email
  }

  if (config.mode === "subscription") {
    params.subscription_data = {
      metadata: {
        userId,
        plan,
      },
    }
  }

  if (config.mode === "payment") {
    params.payment_intent_data = {
      metadata: {
        userId,
        plan,
      },
    }
  }

  return stripe.checkout.sessions.create(params)
}

export async function createPortalSession(
  stripeCustomerId: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
}
