import Stripe from "stripe";

const API_VERSION: Stripe.LatestApiVersion = "2023-10-16";

let cached: Stripe | null = null;

/**
 * Returns a Stripe client. Use only inside API routes / server handlers.
 * Throws at call time (not import time) if STRIPE_SECRET_KEY is missing so
 * Next.js can build and prerender without Stripe env vars.
 */
export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!cached) {
    cached = new Stripe(secret, { apiVersion: API_VERSION });
  }
  return cached;
}
