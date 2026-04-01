/**
 * Stripe Payment Links (https://dashboard.stripe.com/payment-links)
 * Paste your buy.stripe.com URLs here, keyed by product id.
 * You can also set `stripePaymentLink` on each product in `data/products.ts`.
 *
 * Payment Links = one product/price per checkout. For multiple items in one
 * purchase, customers still use Cart → Checkout (Stripe Checkout Session).
 */
export const STRIPE_PAYMENT_LINKS: Partial<Record<string, string>> = {
  // Example:
  // "ur-ebook-compost": "https://buy.stripe.com/test_xxxxxxxxxxxxx",
};
