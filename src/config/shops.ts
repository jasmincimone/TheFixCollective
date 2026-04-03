export type ShopSlug = "urban-roots" | "self-care" | "stitch" | "survival-kits";

/** Emphasis color for small accents (section underline, active tab, badge). Stays within design palette. */
export type ShopEmphasis = "forest" | "gold" | "bark" | "amber";

export type ShopConfig = {
  slug: ShopSlug;
  name: string;
  tagline: string;
  description: string;
  theme: {
    accent: string;
    /** Emphasis for this shop: Urban Roots=forest, Self-Care=gold, Stitch=bark, Survival Kits=amber */
    emphasis: ShopEmphasis;
  };
};

export type ShopCategory = {
  id: string;
  name: string;
  description: string;
};

export type ShopProduct = {
  id: string;
  name: string;
  summary: string;
  badge?: string;
};

export type ShopLandingContent = {
  categories: ShopCategory[];
  featured: ShopProduct[];
};

/** Empty shells: landing categories, featured, and “coming soon” cards come from the database (Admin → shop page). */
const EMPTY_LANDING: ShopLandingContent = { categories: [], featured: [] };

export const SHOP_CONTENT: Record<ShopSlug, ShopLandingContent> = {
  "urban-roots": EMPTY_LANDING,
  "self-care": EMPTY_LANDING,
  stitch: EMPTY_LANDING,
  "survival-kits": EMPTY_LANDING,
};

export const SHOPS: ShopConfig[] = [
  {
    slug: "urban-roots",
    name: "The Fix Urban Roots",
    tagline: "Grow where you are.",
    description:
      "Urban gardening, plant care, and tools for regenerative everyday growing.",
    theme: { accent: "emerald", emphasis: "forest" },
  },
  {
    slug: "self-care",
    name: "The Fix Self Care Co",
    tagline: "Rituals for real life.",
    description:
      "Body care, herbal wellness, and gentle routines that actually stick.",
    theme: { accent: "rose", emphasis: "gold" },
  },
  {
    slug: "stitch",
    name: "The Fix Stitch",
    tagline: "Make, mend, repeat.",
    description:
      "Textiles, mending kits, patterns, and tools for durable creativity.",
    theme: { accent: "indigo", emphasis: "bark" },
  },
  {
    slug: "survival-kits",
    name: "The Fix Survival Kits",
    tagline: "Ready, not rattled.",
    description:
      "Preparedness kits and essentials designed for calm, capable living.",
    theme: { accent: "amber", emphasis: "amber" },
  },
];

export function getShop(slug: string | undefined) {
  return SHOPS.find((s) => s.slug === slug);
}

/** Tailwind-safe classes for emphasis (section underline, active tab, badge). */
const EMPHASIS_CLASSES: Record<
  ShopEmphasis,
  { text: string; border: string; badge: string }
> = {
  forest: {
    text: "text-forest",
    border: "border-forest/30",
    badge: "bg-forest/15 text-forest",
  },
  gold: {
    text: "text-bark",
    border: "border-gold/40",
    badge: "bg-gold/20 text-bark",
  },
  bark: {
    text: "text-bark",
    border: "border-bark/40",
    badge: "bg-bark/15 text-bark",
  },
  amber: {
    text: "text-espresso",
    border: "border-amber/40",
    badge: "bg-amber/20 text-espresso",
  },
};

export function getShopEmphasisClasses(slug: ShopSlug): {
  text: string;
  border: string;
  badge: string;
} {
  const shop = getShop(slug);
  return shop ? EMPHASIS_CLASSES[shop.theme.emphasis] : EMPHASIS_CLASSES.forest;
}
