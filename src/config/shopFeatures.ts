import type { ShopSlug } from "@/config/shops";

export type ShopFeatureCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const DEFAULT_SHOP_FEATURE_SECTIONS: Record<ShopSlug, ShopFeatureCard[]> = {
  "urban-roots": [
    {
      title: "Plant care essentials",
      description: "Soil, tools, and daily habits for thriving greens.",
      href: "/marketplace",
      cta: "Explore marketplace",
    },
    {
      title: "Grow guides",
      description: "Short, practical learning—built for real schedules.",
      href: "/courses",
      cta: "Browse courses",
    },
  ],
  "self-care": [
    {
      title: "Simple rituals",
      description: "Routines designed to feel good and stay consistent.",
      href: "/downloads",
      cta: "See downloads",
    },
    {
      title: "Community support",
      description: "Connect, ask, share, and learn together.",
      href: "/community",
      cta: "Join community",
    },
  ],
  stitch: [
    {
      title: "Patterns & projects",
      description: "From quick repairs to durable keepsakes.",
      href: "/downloads",
      cta: "Get patterns",
    },
    {
      title: "Mending meetups",
      description: "Connect with makers and find tips in the community.",
      href: "/community",
      cta: "Join community",
    },
  ],
  "survival-kits": [
    {
      title: "Preparedness kits",
      description: "Essentials that keep you calm, capable, and ready.",
      href: "/shops/survival-kits",
      cta: "Shop kits",
    },
    {
      title: "Checklists & plans",
      description: "Digital downloads to prep without overwhelm.",
      href: "/downloads",
      cta: "See checklists",
    },
  ],
};
