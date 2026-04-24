import Link from "next/link";
import { Leaf } from "lucide-react";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ShopLogo } from "@/components/ShopLogo";
import { SHOPS } from "@/config/shops";

/** Avoid stale cached HTML if a CDN or older build served the previous two-column hero. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-fix-border/15 bg-fix-bg-muted/40">
        <Container className="py-14 sm:py-20">
          {/* Single-column landing funnel (never a side-by-side hero + shops grid). */}
          <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center text-center">
            <h1 className="text-3xl font-bold tracking-tight text-fix-heading sm:text-4xl md:text-5xl">
              Stay Synced!
            </h1>
            <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-fix-text">
              <p>
                A Marketplace for Self-Sufficiency. A Platform for Connection.
              </p>
              <p>
                Shop handmade goods, supplies, and resources through The Fix Collective — then
                connect on RootSync to learn, share, and participate in a growing network of local
                creators and communities.
              </p>
            </div>
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
              <ButtonLink href="/shops" variant="cta" size="lg" className="uppercase tracking-wide">
                👉 🌱 Shop The Fix Collective
              </ButtonLink>
              <ButtonLink href="/rootsync" variant="secondary" size="lg" className="uppercase tracking-wide">
                👉 🌐 Enter RootSync Platform
              </ButtonLink>
              <ButtonLink
                href="/products/amara-plants-a-seed-kit"
                variant="secondary"
                size="lg"
                className="uppercase tracking-wide"
              >
                👉 🌱✅ Buy The Amara Roots Sprout Check Kit
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto mt-12 w-full max-w-lg sm:mt-14">
            <div className="overflow-hidden rounded-2xl bg-fix-surface ring-1 ring-fix-border/15 shadow-soft">
              {/* Plain img: always serves from /public; avoids next/image optimizer quirks in some dev setups. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/home/hero-product-lineup.png"
                alt="THE FIX SELF-CARE CO. products—teas, soaps, balms, and survival kits—arranged on a rustic wooden table with soft leaf shadows."
                width={1200}
                height={1800}
                className="block h-auto w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          <div className="mx-auto mt-14 w-full min-w-0 max-w-4xl overflow-hidden rounded-2xl bg-espresso shadow-soft ring-1 ring-fix-border/10 sm:mt-16">
            <div className="flex flex-col items-center px-6 py-10 text-clay sm:py-12">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/60">
                <Leaf className="h-8 w-8 text-gold" aria-hidden />
              </span>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold tracking-tight sm:text-3xl">THE FIX</div>
                <div className="mx-auto mt-1 h-px w-12 bg-gold/50" />
                <div className="mt-1 text-lg font-medium tracking-wide text-clay/90">COLLECTIVE</div>
              </div>
              <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-clay/85 sm:text-base">
                Experience all that The Fix Collective has to offer, from urban gardening and
                self-care products, to survival preparedness—we have you covered when it comes to the
                highest level of self-love, self-care, and self-expression.
              </p>
            </div>
            <div className="border-t border-clay/10 px-4 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-clay/70">
                Shop by category
              </p>
              <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {SHOPS.map((shop) => (
                  <Link
                    key={shop.slug}
                    href={`/shops/${shop.slug}`}
                    className="group flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-2xl border border-clay/25 bg-clay/10 px-3 py-5 text-clay transition-all duration-200 hover:border-gold/50 hover:bg-clay/15 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-espresso"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-clay/30 bg-clay/20 transition-colors group-hover:border-gold/40">
                      <ShopLogo
                        shopSlug={shop.slug}
                        shopDisplayName={shop.name.replace("The Fix ", "")}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <span className="text-center text-sm font-semibold leading-tight text-clay">
                      {shop.name.replace("The Fix ", "")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <div className="text-sm font-semibold text-fix-heading">
                RootSync (AI)
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                A dedicated surface for the RootSync assistant, designed to slot
                in when you’re ready with the first workflows.
              </p>
              <div className="mt-4">
                <ButtonLink href="/rootsyncai" variant="secondary" size="sm">
                  View RootSync AI
                </ButtonLink>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
