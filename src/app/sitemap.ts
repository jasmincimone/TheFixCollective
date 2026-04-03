import type { MetadataRoute } from "next";

import { SHOPS } from "@/config/shops";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: "https://thefixcollective.com", lastModified: now },
    { url: "https://thefixcollective.com/shops", lastModified: now },
    ...SHOPS.map((s) => ({
      url: `https://thefixcollective.com/shops/${s.slug}`,
      lastModified: now
    })),
    { url: "https://thefixcollective.com/community", lastModified: now },
    { url: "https://thefixcollective.com/marketplace", lastModified: now },
    { url: "https://thefixcollective.com/courses", lastModified: now },
    { url: "https://thefixcollective.com/downloads", lastModified: now },
    { url: "https://thefixcollective.com/messages/inbox", lastModified: now },
    { url: "https://thefixcollective.com/rootsync", lastModified: now }
  ];
}

