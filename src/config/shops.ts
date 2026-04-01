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

export const SHOPS: ShopConfig[] = [
  {
    slug: "urban-roots",
    name: "The Fix Urban Roots",
    tagline: "Grow where you are.",
    description:
      "Urban gardening, plant care, and tools for regenerative everyday growing.",
    theme: { accent: "emerald", emphasis: "forest" }
  },
  {
    slug: "self-care",
    name: "The Fix Self-Care",
    tagline: "Rituals for real life.",
    description:
      "Body care, herbal wellness, and gentle routines that actually stick.",
    theme: { accent: "rose", emphasis: "gold" }
  },
  {
    slug: "stitch",
    name: "The Fix Stitch",
    tagline: "Make, mend, repeat.",
    description:
      "Textiles, mending kits, patterns, and tools for durable creativity.",
    theme: { accent: "indigo", emphasis: "bark" }
  },
  {
    slug: "survival-kits",
    name: "The Fix Survival Kits",
    tagline: "Ready, not rattled.",
    description:
      "Preparedness kits and essentials designed for calm, capable living.",
    theme: { accent: "amber", emphasis: "amber" }
  }
];

export const SHOP_CONTENT: Record<ShopSlug, ShopLandingContent> = {
  "urban-roots": {
    categories: [
      {
        id: "garden-beds",
        name: "Garden beds",
        description: "Modular raised beds, containers, and balcony-friendly setups."
      },
      {
        id: "seedlings",
        name: "Seedlings",
        description: "Seasonal veggie, herb, and flower starts for small spaces."
      },
      {
        id: "kids-gardening",
        name: "Kids gardening",
        description: "Story-led kits and activities for little growers (ages 3–8)."
      },
      {
        id: "ebooks",
        name: "Ebooks",
        description: "Downloadable guides for soil health, watering, and urban composting."
      },
      {
        id: "education",
        name: "Education",
        description: "Workshops and mini-courses for first-time and returning growers."
      }
    ],
    featured: [
      {
        id: "starter-bed-kit",
        name: "Urban starter bed kit",
        summary: "Everything you need to plant your first 4x4 bed—soil, amendments, and plan.",
        badge: "Best for beginners"
      },
      {
        id: "balcony-greens-pack",
        name: "Balcony greens seedling pack",
        summary: "A curated mix of leafy greens that thrive in containers.",
        badge: "Seasonal"
      }
    ]
  },
  "self-care": {
    categories: [
      {
        id: "self-care-products",
        name: "Self-care products",
        description: "Body oils, bath soaks, salves, and aromatherapy rooted in plant care."
      }
    ],
    featured: [
      {
        id: "evening-reset-ritual",
        name: "Evening reset ritual kit",
        summary: "A simple, three-step ritual for unwinding at the end of the day.",
        badge: "Customer favorite"
      },
      {
        id: "grounding-body-oil",
        name: "Grounding body oil",
        summary: "Slow-crafted oil blend for daily moisturizing and massage.",
        badge: "New"
      }
    ]
  },
  stitch: {
    categories: [
      {
        id: "crochet-wearables",
        name: "Crochet wearables",
        description: "Handmade garments, accessories, and heirloom pieces."
      },
      {
        id: "crochet-patterns",
        name: "Crochet designs & patterns",
        description: "Downloadable patterns and design templates for all skill levels."
      }
    ],
    featured: [
      {
        id: "everyday-cardigan",
        name: "Everyday crochet cardigan",
        summary: "A modern, layerable cardigan designed for repeat wear.",
        badge: "Limited run"
      },
      {
        id: "mending-pattern-pack",
        name: "Mending pattern pack",
        summary: "A bundle of visible-mending patterns for denim, knits, and more.",
        badge: "Digital"
      }
    ]
  },
  "survival-kits": {
    categories: [
      {
        id: "survival-gear",
        name: "Survival gear",
        description: "Tools, lighting, water systems, and essentials for real emergencies."
      },
      {
        id: "emergency-food-kits",
        name: "Emergency food kits",
        description: "Shelf-stable, easy-to-cook meals tailored to different households."
      }
    ],
    featured: [
      {
        id: "72-hour-home-kit",
        name: "72-hour home survival kit",
        summary: "Core supplies for three days of power or water disruption.",
        badge: "Core kit"
      },
      {
        id: "go-bag-mini",
        name: "Mini go-bag",
        summary: "A compact kit for your car, commute, or grab-and-go moments.",
        badge: "Compact"
      }
    ]
  }
};

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

