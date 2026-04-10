import Link from "next/link";

import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "About us",
  description:
    "RootSync connects food, goods, and communities through one unified system for local economies.",
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
            RootSync is building the infrastructure for local economies—connecting food, goods, and
            communities through one unified system. It combines smart planning tools, a local marketplace,
            and community-driven access to help growers and makers stop guessing and start building with
            purpose.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fix-text-muted">
            Whether you&apos;re producing, selling, or simply looking to buy local, RootSync makes it easier
            to stay connected to what&apos;s happening right where you are.
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
