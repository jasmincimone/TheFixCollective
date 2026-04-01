import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  getShop,
  getShopEmphasisClasses,
  SHOP_CONTENT,
  type ShopSlug
} from "@/config/shops";

export function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  const shop = getShop(params.slug);
  if (!shop) return {};

  return {
    title: shop.name,
    description: shop.description
  };
}

const FEATURE_SECTIONS: Record<
  string,
  { title: string; description: string; href: string; cta: string }[]
> = {
  "urban-roots": [
    {
      title: "Plant care essentials",
      description: "Soil, tools, and daily habits for thriving greens.",
      href: "/marketplace",
      cta: "Explore marketplace"
    },
    {
      title: "Grow guides",
      description: "Short, practical learning—built for real schedules.",
      href: "/courses",
      cta: "Browse courses"
    }
  ],
  "self-care": [
    {
      title: "Simple rituals",
      description: "Routines designed to feel good and stay consistent.",
      href: "/downloads",
      cta: "See downloads"
    },
    {
      title: "Community support",
      description: "Connect, ask, share, and learn together.",
      href: "/community",
      cta: "Join community"
    }
  ],
  stitch: [
    {
      title: "Patterns & projects",
      description: "From quick repairs to durable keepsakes.",
      href: "/downloads",
      cta: "Get patterns"
    },
    {
      title: "Mending meetups",
      description: "Connect with makers and find tips in the community.",
      href: "/community",
      cta: "Join community"
    }
  ],
  "survival-kits": [
    {
      title: "Preparedness kits",
      description: "Essentials that keep you calm, capable, and ready.",
      href: "/shops/survival-kits",
      cta: "Shop kits"
    },
    {
      title: "Checklists & plans",
      description: "Digital downloads to prep without overwhelm.",
      href: "/downloads",
      cta: "See checklists"
    }
  ]
};

export default function ShopPage({ params }: { params: { slug: string } }) {
  const shop = getShop(params.slug);
  if (!shop) notFound();

  const shopKey = shop.slug as ShopSlug;
  const content = SHOP_CONTENT[shopKey];
  const features = FEATURE_SECTIONS[shop.slug] ?? [];

  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="min-w-0">
              <div className={`inline-flex items-center gap-2 rounded-full border border-fix-border/20 bg-fix-surface px-3 py-1 text-xs font-semibold shadow-soft ${getShopEmphasisClasses(shop.slug).text}`}>
                Shop
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
                {shop.name}
              </h1>
              <p className="mt-2 text-lg text-fix-text-muted">{shop.tagline}</p>
              <p className="mt-4 text-base leading-relaxed text-fix-text-muted">
                {shop.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={`/shops/${shop.slug}/products`} size="lg" variant="primary">
                  View all products
                </ButtonLink>
                <ButtonLink href="/downloads" variant="secondary" size="lg">
                  Digital downloads
                </ButtonLink>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative flex h-52 w-52 shrink-0 items-center justify-center rounded-2xl border border-fix-border/15 bg-fix-bg-muted/80 p-6 shadow-soft sm:h-60 sm:w-60 lg:h-80 lg:w-80">
                <Image
                  src={`/images/shops/${shop.slug}/logo.png`}
                  alt=""
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 192px, 320px"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <div className="text-sm font-semibold text-fix-heading">
                Categories
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                Explore what this shop offers today. These categories map cleanly
                to collections or product groups in your ecommerce backend.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {content.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`rounded-2xl border border-fix-border/15 bg-fix-bg-muted p-4 ${getShopEmphasisClasses(shop.slug).border}`}
                  >
                    <div className="text-sm font-semibold text-fix-heading">
                      {cat.name}
                    </div>
                    <div className="mt-1 text-sm text-fix-text-muted">
                      {cat.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-fix-heading">
                Featured items
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                A small, curated set of hero products or kits for this shop.
              </p>
              <div className="mt-4 grid gap-3">
                {content.featured.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-fix-border/15 bg-fix-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-fix-heading">
                          {item.name}
                        </div>
                        <div className="mt-1 text-sm text-fix-text-muted">
                          {item.summary}
                        </div>
                      </div>
                      {item.badge ? (
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getShopEmphasisClasses(shop.slug).badge}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {features.length > 0 ? (
            <div className="mt-8">
              <Card className="p-6">
                <div className="text-sm font-semibold text-fix-heading">
                  Next up
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="rounded-2xl border border-fix-border/15 bg-fix-surface p-4"
                    >
                      <div className="text-sm font-semibold text-fix-heading">
                        {f.title}
                      </div>
                      <div className="mt-1 text-sm text-fix-text-muted">
                        {f.description}
                      </div>
                      <div className="mt-3">
                        <ButtonLink href={f.href} variant="ghost" size="sm">
                          {f.cta}
                        </ButtonLink>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}

