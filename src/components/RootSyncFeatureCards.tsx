"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

const FEATURES = [
  {
    id: "ask",
    title: "Ask RootSync",
    body: "Chat below for crop plans, soil tips, nutrition ideas, and small-farm business questions—powered by OpenAI.",
  },
  {
    id: "plans",
    title: "Personalized Plans",
    body: "Saves your context, goals, and preferences (with clear privacy controls).",
  },
  {
    id: "shop",
    title: "Shop-aware recommendations",
    body: "Suggests products, downloads, and courses across the four shops.",
  },
] as const;

const cardBase =
  "rounded-2xl border border-fix-border/15 bg-fix-surface shadow-soft transition-colors hover:bg-fix-bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2 focus-visible:ring-offset-fix-bg";

export function RootSyncFeatureCards() {
  const [openId, setOpenId] = useState<string | null>(null);

  const active = openId
    ? FEATURES.find((f) => f.id === openId) ?? null
    : null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {active ? (
        <button
          type="button"
          className={cn(
            cardBase,
            "col-span-1 flex w-full flex-col items-center justify-center px-6 py-8 text-center sm:col-span-3 sm:aspect-[3/1] max-sm:aspect-[1/3] max-sm:min-h-0",
          )}
          onClick={() => setOpenId(null)}
          aria-expanded
        >
          <span className="text-sm font-semibold text-fix-heading">
            {active.title}
          </span>
          <p className="mt-3 max-w-prose text-sm text-fix-text-muted">
            {active.body}
          </p>
        </button>
      ) : (
        FEATURES.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cn(
              cardBase,
              "flex aspect-square w-full items-center justify-center px-4 py-6 text-center",
            )}
            onClick={() => setOpenId(f.id)}
            aria-expanded={false}
          >
            <span className="text-sm font-semibold text-fix-heading">
              {f.title}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
