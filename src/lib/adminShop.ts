import { SHOPS, type ShopSlug } from "@/config/shops";

export function parseShopSlugParam(slug: string): ShopSlug | null {
  const ok = SHOPS.some((s) => s.slug === slug);
  return ok ? (slug as ShopSlug) : null;
}
