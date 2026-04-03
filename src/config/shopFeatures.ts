import type { ShopSlug } from "@/config/shops";

export type ShopFeatureCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

/** No seed cards — “Coming soon” rows come from Admin → shop page (featureSectionsJson). */
export const DEFAULT_SHOP_FEATURE_SECTIONS: Record<ShopSlug, ShopFeatureCard[]> = {
  "urban-roots": [],
  "self-care": [],
  stitch: [],
  "survival-kits": [],
};
