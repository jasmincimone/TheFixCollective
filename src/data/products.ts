import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  // ——— The Fix Urban Roots ———
  {
    id: "ur-starter-bed-kit",
    name: "Urban starter bed kit",
    summary: "Everything you need to plant your first 4x4 bed—soil, amendments, and plan.",
    description:
      "A complete kit for your first raised bed: organic soil blend, amendments, step-by-step plan, and optional seedling vouchers. Perfect for balconies and small yards.",
    price: 8999,
    type: "physical",
    shop: "urban-roots",
    categoryId: "garden-beds",
    badge: "Best for beginners"
  },
  {
    id: "ur-amara-plants-a-seed-kit",
    name: "Amara Plants a Seed (coloring book + seedling kit)",
    summary:
      "A children’s coloring storybook paired with a hands-on seedling kit for ages 3–8.",
    description:
      "Amara Plants a Seed is a story-led coloring book that helps little growers learn the basics of planting, patience, and care. Each order includes the coloring storybook plus a kid-friendly seedling kit so children can start their very own seedling at home.\n\nWhat’s included:\n- 1 seed pack (your choice): 5x Sweet Thai Basil seeds, or 5x Tokyo Long White Bunching/Scallion Onion seeds, or 5x Buttercrunch Butterhead Lettuce seeds\n- 4 oz spray bottle of Root Food Spray\n- 15 mL dropper of Root Food Drops\n- Cup of soil mix\n- Biodegradable planter with humidity dome + label\n- Amara Plants a Seed Coloring Storybook by Jasmin Cimone Smith\n- Instruction card\n- Sprout Check Squad badge",
    price: 3000,
    type: "physical",
    shop: "urban-roots",
    categoryId: "kids-gardening",
    image: "/images/shops/urban-roots/products/ur-amara-plants-a-seed-kit.png",
    imageFit: "contain",
    options: [
      {
        id: "seed",
        label: "Seed choice",
        choices: [
          { id: "sweet-thai-basil", label: "Sweet Thai Basil" },
          { id: "tokyo-long-white-scallion-onion", label: "Tokyo Long White Bunching / Scallion Onion" },
          { id: "buttercrunch-butterhead-lettuce", label: "Buttercrunch Butterhead Lettuce" },
        ],
      },
    ],
    badge: "New"
  },
  {
    id: "ur-balcony-greens-pack",
    name: "Balcony greens seedling pack",
    summary: "A curated mix of leafy greens that thrive in containers.",
    description:
      "Six seasonal seedlings chosen for containers: lettuce, kale, herbs. Includes care card and optional planter.",
    price: 3499,
    type: "physical",
    shop: "urban-roots",
    categoryId: "seedlings"
  },
  {
    id: "ur-ebook-compost",
    name: "Urban composting ebook",
    summary: "Downloadable guide to small-space composting and soil health.",
    description:
      "PDF guide covering worm bins, bokashi, and no-turn methods. Includes recipes and troubleshooting.",
    price: 1299,
    type: "digital",
    shop: "urban-roots",
    categoryId: "ebooks",
    format: "PDF"
  },
  {
    id: "ur-ebook-watering",
    name: "Water-wise watering guide",
    summary: "Ebook on irrigation and watering schedules for urban gardens.",
    description:
      "Digital guide to drip systems, hand-watering routines, and saving water in small plots.",
    price: 999,
    type: "digital",
    shop: "urban-roots",
    categoryId: "ebooks",
    format: "PDF"
  },
  {
    id: "ur-workshop-intro",
    name: "Intro to urban growing (workshop)",
    summary: "Live 2-hour workshop for first-time growers.",
    description:
      "One-time online or in-person workshop: site assessment, soil basics, and your first planting plan.",
    price: 4999,
    type: "physical",
    shop: "urban-roots",
    categoryId: "education",
    badge: "Live"
  },
  // ——— The Fix Self-Care ———
  {
    id: "sc-evening-ritual-kit",
    name: "Evening reset ritual kit",
    summary: "A simple, three-step ritual for unwinding at the end of the day.",
    description:
      "Body oil, candle, and a short guide to a 15-minute wind-down. Physical kit shipped to you.",
    price: 4299,
    type: "physical",
    shop: "self-care",
    categoryId: "self-care-products",
    badge: "Customer favorite"
  },
  {
    id: "sc-grounding-body-oil",
    name: "Grounding body oil",
    summary: "Slow-crafted oil blend for daily moisturizing and massage.",
    description:
      "Organic jojoba and essential oils. 2 oz bottle. Suitable for face and body.",
    price: 2899,
    type: "physical",
    shop: "self-care",
    categoryId: "self-care-products",
    badge: "New"
  },
  {
    id: "sc-bath-soak-lavender",
    name: "Lavender bath soak",
    summary: "Plant-based bath soak for relaxation and sleep.",
    description:
      "Epsom salt and lavender blend. One jar, about 4–6 baths. No synthetic fragrances.",
    price: 1999,
    type: "physical",
    shop: "self-care",
    categoryId: "self-care-products"
  },
  // ——— The Fix Stitch ———
  {
    id: "st-everyday-cardigan",
    name: "Everyday crochet cardigan",
    summary: "A modern, layerable cardigan designed for repeat wear.",
    description:
      "Hand-crocheted cardigan in a neutral shade. One size fits most. Care: hand wash, lay flat to dry.",
    price: 12999,
    type: "physical",
    shop: "stitch",
    categoryId: "crochet-wearables",
    badge: "Limited run"
  },
  {
    id: "st-mending-pattern-pack",
    name: "Mending pattern pack",
    summary: "A bundle of visible-mending patterns for denim, knits, and more.",
    description:
      "Digital download: 5 PDF patterns (sashiko, darning, patches) with photo tutorials.",
    price: 1499,
    type: "digital",
    shop: "stitch",
    categoryId: "crochet-patterns",
    format: "ZIP (PDFs)",
    badge: "Digital"
  },
  {
    id: "st-crochet-scarf-pattern",
    name: "Crochet scarf pattern",
    summary: "Downloadable pattern for a simple, textured scarf.",
    description:
      "PDF pattern with written instructions and chart. Suitable for beginners.",
    price: 699,
    type: "digital",
    shop: "stitch",
    categoryId: "crochet-patterns",
    format: "PDF"
  },
  {
    id: "st-beanie-handmade",
    name: "Handmade crochet beanie",
    summary: "Warm, stretchy beanie in a classic stitch.",
    description:
      "One-of-a-kind beanie. Color options at checkout. Hand wash only.",
    price: 4499,
    type: "physical",
    shop: "stitch",
    categoryId: "crochet-wearables"
  },
  // ——— The Fix Survival Kits ———
  {
    id: "sk-72hr-home-kit",
    name: "72-hour home survival kit",
    summary: "Core supplies for three days of power or water disruption.",
    description:
      "Flashlights, first aid, water pouches, food bars, radio, and checklist. Designed for home use.",
    price: 7999,
    type: "physical",
    shop: "survival-kits",
    categoryId: "survival-gear",
    badge: "Core kit"
  },
  {
    id: "sk-go-bag-mini",
    name: "Mini go-bag",
    summary: "A compact kit for your car, commute, or grab-and-go moments.",
    description:
      "Small bag with first aid, light, water, snacks, and emergency contact card.",
    price: 3999,
    type: "physical",
    shop: "survival-kits",
    categoryId: "survival-gear",
    badge: "Compact"
  },
  {
    id: "sk-emergency-food-3day",
    name: "3-day emergency food kit",
    summary: "Shelf-stable, easy-to-prepare meals for three days.",
    description:
      "Breakfast and dinner options, no cooking required. Long shelf life. Serves one person for 3 days.",
    price: 4499,
    type: "physical",
    shop: "survival-kits",
    categoryId: "emergency-food-kits"
  },
  {
    id: "sk-water-purifier",
    name: "Portable water purifier",
    summary: "Compact purifier for travel and emergencies.",
    description:
      "Removes bacteria and protozoa. Good for up to 1000 liters. Includes carry pouch.",
    price: 3499,
    type: "physical",
    shop: "survival-kits",
    categoryId: "survival-gear"
  }
];

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string | undefined): Product | undefined {
  return id ? byId.get(id) : undefined;
}

export function getProductsByShop(shop: string): Product[] {
  return PRODUCTS.filter((p) => p.shop === shop);
}

export function getProductsByCategory(shop: string, categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.shop === shop && p.categoryId === categoryId);
}
