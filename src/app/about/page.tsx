import Link from "next/link";

import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "About us",
  description:
    "The Fix Collective brings together urban growing, self-care, making, and preparedness under one brand.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
            About us
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fix-text-muted">
            The Fix Collective is a modern platform built around four distinct shops—Urban Roots, Self Care
            Co, Stitch, and Survival Kits—so you can grow, care, make, and prepare with confidence. We
            combine curated products, community, a farmer marketplace, and tools like RootSync AI to
            support self-love, self-care, and self-expression in everyday life.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fix-text-muted">
            Whether you&apos;re starting a balcony garden, building gentle rituals, mending what you love,
            or keeping your household ready, we&apos;re here to meet you where you are.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shops" variant="cta" size="md">
              Explore the shops
            </ButtonLink>
            <ButtonLink href="/signup" variant="secondary" size="md">
              Join now
            </ButtonLink>
            <Link
              href="/"
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-fix-link ring-1 ring-fix-border/20 hover:bg-fix-bg-muted"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
