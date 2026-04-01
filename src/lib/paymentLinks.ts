import { STRIPE_PAYMENT_LINKS } from "@/config/paymentLinks";
import type { Product } from "@/types/product";

/** Resolves Stripe Payment Link URL for a product (inline field or central map). */
export function getStripePaymentLink(product: Product): string | undefined {
  return product.stripePaymentLink ?? STRIPE_PAYMENT_LINKS[product.id];
}
