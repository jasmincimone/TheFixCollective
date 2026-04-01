import type { ShopSlug } from "@/config/shops";

export type ProductType = "physical" | "digital";

export type ProductOption = {
  /** Stable option id used in cart/order metadata, e.g. "seed" */
  id: string;
  /** Human label, e.g. "Seed choice" */
  label: string;
  choices: Array<{
    /** Stable choice id, e.g. "sweet-thai-basil" */
    id: string;
    /** Human label, e.g. "Sweet Thai Basil" */
    label: string;
  }>;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  summary: string;
  price: number; // cents
  type: ProductType;
  shop: ShopSlug;
  categoryId: string;
  image?: string; // path or URL; optional for placeholder
  /** Default `cover`. Use `contain` for book covers / artwork where cropping hides text. */
  imageFit?: "cover" | "contain";
  badge?: string;
  /** For digital: e.g. "PDF", "ZIP" */
  format?: string;
  /** Optional variants/options that affect what the customer receives. */
  options?: ProductOption[];
  /**
   * Optional Stripe Payment Link URL (https://buy.stripe.com/...).
   * When set, "Buy now" uses this link instead of only add-to-cart.
   */
  stripePaymentLink?: string;
};

export type CartItem = {
  /** Unique key for product + selections. */
  key: string;
  productId: string;
  quantity: number;
  selections?: Record<string, string>; // optionId -> choiceId
};

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  email: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number; type: ProductType }>;
  shippingAddress?: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string; // ISO
};
