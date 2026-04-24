"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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
    href: "/rootsync",
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
  const [selectedId, setSelectedId] = useState<string>(FEATURES[0].id);
  const selected = useMemo(
    () => FEATURES.find((feature) => feature.id === selectedId) ?? FEATURES[0],
    [selectedId]
  );

  return (
    <div className="mt-10">
      <div className="rounded-3xl border border-fix-border/20 bg-fix-surface/70 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setSelectedId(feature.id)}
              className={cn(
                "group rounded-2xl border border-fix-border/20 bg-fix-bg-muted/35 p-2 text-left transition hover:bg-fix-bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2",
                selected.id === feature.id && "border-fix-cta/60 bg-fix-bg-muted"
              )}
              aria-pressed={selected.id === feature.id}
            >
              <Image
                src={feature.iconSrc}
                alt={feature.title}
                width={420}
                height={420}
                className="h-auto w-full rounded-xl object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            src={selected.iconSrc}
            alt={selected.title}
            width={210}
            height={210}
            className="h-auto w-full max-w-[180px] rounded-2xl border border-fix-border/15 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-fix-heading">{selected.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">{selected.description}</p>
            <div className="mt-5">
              <ButtonLink href={selected.href} variant="cta" size="md">
                Go to {selected.title}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
