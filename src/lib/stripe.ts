import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Returns a Stripe client (named `stripeClient` in calling code).
 *
 * IMPORTANT:
 * - Fill `STRIPE_SECRET_KEY` in your environment before using this sample.
 * - We intentionally do NOT hardcode `apiVersion` here. The Stripe SDK will
 *   use its current default API version automatically.
 */
export function getStripeClient(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add STRIPE_SECRET_KEY=sk_test_... to .env.local and restart the dev server."
    );
  }
  if (!cached) {
    cached = new Stripe(secret);
  }
  return cached;
}

/** Backwards-compatible alias for existing routes already using `getStripe()`. */
export const getStripe = getStripeClient;
