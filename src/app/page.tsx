import Link from "next/link";
import { Leaf } from "lucide-react";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ShopLogo } from "@/components/ShopLogo";
import { SHOPS } from "@/config/shops";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-0">
          <div className="grid min-h-[70vh] gap-0 lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            {/* Left: hero copy */}
            <div className="flex flex-col justify-center bg-fix-bg-muted px-6 py-14 sm:px-8 sm:py-20 lg:rounded-l-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-fix-heading sm:text-4xl md:text-5xl">
                Let&apos;s Grow Something!
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-fix-text">
                Experience all that The Fix Collective has to offer, from urban gardening and
                self-care products, to survival preparedness, we have you covered
                when it comes to the highest level of self-love, self-care, and
                self-expression.
              </p>
              <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                <ButtonLink href="/about" variant="cta" size="lg" className="uppercase tracking-wide">
                  About us
                </ButtonLink>
                <ButtonLink href="/signup" variant="secondary" size="lg" className="uppercase tracking-wide">
                  Sign up
                </ButtonLink>
              </div>
            </div>

            {/* Right: brand block + shop links */}
            <div className="flex flex-col bg-espresso lg:rounded-r-2xl">
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-clay">
                <div className="flex flex-col items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/60">
                    <Leaf className="h-8 w-8 text-gold" aria-hidden />
                  </span>
                  <div className="text-center">
                    <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                      THE FIX
                    </div>
                    <div className="mt-1 h-px w-12 bg-gold/50 mx-auto" />
                    <div className="mt-1 text-lg font-medium tracking-wide text-clay/90">
                      COLLECTIVE
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-clay/10 px-4 pb-6 pt-5 sm:px-6 sm:pt-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-clay/70">
                  Shop by category
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  {SHOPS.map((shop) => (
                    <Link
                      key={shop.slug}
                      href={`/shops/${shop.slug}`}
                      className="group flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-2xl border border-clay/25 bg-clay/10 px-4 py-5 text-clay transition-all duration-200 hover:border-gold/50 hover:bg-clay/15 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-espresso"
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
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <div className="text-sm font-semibold text-fix-heading">
                Community-ready
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                Structured routes for messaging, marketplace, and community features,
                with clear placeholders you can progressively enhance.
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-semibold text-fix-heading">
                RootSync (AI)
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                A dedicated surface for the RootSync assistant, designed to slot
                in when you’re ready with the first workflows.
              </p>
              <div className="mt-4">
                <ButtonLink href="/rootsync" variant="secondary" size="sm">
                  View RootSync page
                </ButtonLink>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
