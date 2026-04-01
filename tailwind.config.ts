import type { Config } from "tailwindcss";

const fixTokens = {
  clay: "#e1cec3",
  espresso: "#342a0f",
  bark: "#59281d",
  gold: "#b8895f",
  forest: "#044730",
  amber: "#e59a28",
  "clay-muted": "#d4bcae",
  "surface-tint": "#e8ded6",
};

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...fixTokens,
        fix: {
          bg: fixTokens.clay,
          "bg-muted": fixTokens["clay-muted"],
          surface: fixTokens["surface-tint"],
          text: fixTokens.espresso,
          "text-muted": fixTokens.bark,
          heading: fixTokens.bark,
          border: fixTokens.espresso,
          accent: fixTokens.gold,
          primary: fixTokens.forest,
          "primary-foreground": fixTokens.clay,
          cta: fixTokens.amber,
          "cta-foreground": fixTokens.espresso,
          link: fixTokens.forest,
          "link-hover": fixTokens.amber,
          "focus-ring": fixTokens.amber,
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(52, 42, 15, 0.08)",
        "focus-ring": "0 0 0 2px var(--focus-ring)",
      },
      ringColor: {
        fix: "var(--focus-ring)",
      },
    },
  },
  plugins: [],
};

export default config;
