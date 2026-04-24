"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Feature = {
  id: string;
  title: string;
  href: string;
  iconSrc: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    id: "marketplace",
    title: "Marketplace",
    href: "/marketplace",
    iconSrc: "/images/platform/features/marketplace.png",
    description:
      "Discover vendor listings, browse local goods, and connect directly with growers and makers in your area.",
  },
  {
    id: "community",
    title: "Community",
    href: "/community",
    iconSrc: "/images/platform/features/community.png",
    description:
      "Share updates, ask questions, and learn from others building local food and creative ecosystems.",
  },
  {
    id: "rootsync-ai",
    title: "RootSync AI",
    href: "/rootsyncai",
    iconSrc: "/images/platform/features/rootsync-ai.png",
    description:
      "Use the AI assistant for guidance on planning, growing, and running resilient local business workflows.",
  },
  {
    id: "messages",
    title: "Messages",
    href: "/messages/inbox",
    iconSrc: "/images/platform/features/messages.png",
    description:
      "Message vendors and community members directly so collaboration and transactions stay simple and personal.",
  },
  {
    id: "courses",
    title: "Courses",
    href: "/courses",
    iconSrc: "/images/platform/features/courses.png",
    description:
      "Access learning content and skill-building resources designed to support self-sufficiency and local growth.",
  },
  {
    id: "downloads",
    title: "Downloads",
    href: "/downloads",
    iconSrc: "/images/platform/features/downloads.png",
    description:
      "Grab practical resources, templates, and tools you can use right away in your projects and routines.",
  },
];

export function PlatformFeaturesExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => FEATURES.find((feature) => feature.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return (
    <div className="mt-10">
      <div className="relative rounded-3xl bg-fix-surface/70 p-1.5 sm:p-2 md:p-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setSelectedId(feature.id)}
              aria-label={`Open ${feature.title}`}
              className={cn(
                "group rounded-[18px] bg-[#f3f0ed] p-1.5 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2 sm:rounded-[22px] sm:p-2 md:rounded-[26px] md:p-2.5",
                selected?.id === feature.id && "ring-2 ring-fix-cta/60"
              )}
              aria-pressed={selected?.id === feature.id}
            >
              <Image
                src={feature.iconSrc}
                alt=""
                width={420}
                height={420}
                sizes="(max-width: 640px) 42vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 33vw"
                className="mx-auto h-auto w-full max-w-[9rem] rounded-[14px] object-cover sm:max-w-[11rem] sm:rounded-[18px] md:mx-0 md:max-w-none md:rounded-[22px]"
              />
            </button>
          ))}
        </div>

        {selected ? (
          <button
            type="button"
            aria-label="Close feature details"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-20 rounded-3xl bg-fix-surface/45 backdrop-blur-[2px]"
          >
            <span className="sr-only">Close</span>
          </button>
        ) : null}

        {selected ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6">
            <Card
              className="relative w-full max-w-2xl p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-fix-text-muted hover:bg-fix-bg-muted hover:text-fix-heading"
                aria-label="Close"
              >
                X
              </button>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Image
                  src={selected.iconSrc}
                  alt={selected.title}
                  width={210}
                  height={210}
                  className="h-auto w-full max-w-[170px] rounded-2xl border border-fix-border/15 object-cover"
                />
                <div className="min-w-0 flex-1 pr-6 sm:pr-8">
                  <h3 className="text-xl font-semibold text-fix-heading">{selected.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                    {selected.description}
                  </p>
                  <div className="mt-5">
                    <ButtonLink href={selected.href} variant="cta" size="md">
                      Go to {selected.title}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
      {!selected ? (
        <p className="mt-5 text-center text-sm text-fix-text-muted">
          Click any feature tile to open details.
        </p>
      ) : null}
    </div>
  );
}
