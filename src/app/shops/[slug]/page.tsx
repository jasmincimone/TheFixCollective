import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { getShop, getShopEmphasisClasses, type ShopSlug } from "@/config/shops";
import { loadMergedShopDisplay, SHOP_LANDING_FEATURED_LIMIT } from "@/lib/shopPageDisplay";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const shop = getShop(params.slug);
  if (!shop) return {};
  const display = await loadMergedShopDisplay(params.slug);
  return {
    title: display?.name ?? shop.name,
    description: display?.description ?? shop.description,
  };
}

export default async function ShopPage({ params }: { params: { slug: string } }) {
  const shop = getShop(params.slug);
  if (!shop) notFound();

  const display = await loadMergedShopDisplay(params.slug);
  if (!display) notFound();

  const shopKey = shop.slug as ShopSlug;
  const content = display.content;
  const features = display.features;

  const hasFeatured = content.featured.length > 0;
  const hasCategories = content.categories.length > 0;
  const hasComingSoon = features.length > 0;
  const hasCatalogSection = hasFeatured || hasCategories || hasComingSoon;

  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="min-w-0">
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-fix-border/20 bg-fix-surface px-3 py-1 text-xs font-semibold shadow-soft ${getShopEmphasisClasses(shopKey).text}`}
              >
                Shop
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
                {display.name}
              </h1>
              <p className="mt-2 text-lg text-fix-text-muted">{display.tagline}</p>
              <p className="mt-4 text-base leading-relaxed text-fix-text-muted">
                {display.description}
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

      {hasCatalogSection ? (
        <section>
          <Container className="py-12">
            {hasFeatured ? (
              <Card className="p-6">
                <div className="text-sm font-semibold text-fix-heading">Featured items</div>
                <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                  The {SHOP_LANDING_FEATURED_LIMIT} most recently added published products in this shop.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {content.featured.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className="block rounded-2xl border border-fix-border/15 bg-fix-surface p-4 transition-colors hover:border-fix-border/30 hover:bg-fix-bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2 focus-visible:ring-offset-fix-bg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-fix-heading">{item.name}</div>
                          <div className="mt-1 text-sm text-fix-text-muted">{item.summary}</div>
                        </div>
                        {item.badge ? (
                          <span
                            className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getShopEmphasisClasses(shopKey).badge}`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            ) : null}

            {hasCategories ? (
              <Card className={`p-6 ${hasFeatured ? "mt-6" : ""}`}>
                <div className="text-sm font-semibold text-fix-heading">Categories</div>
                <p className="mt-2 text-sm leading-relaxed text-fix-text-muted">
                  Explore what this shop offers. These categories map to collections or product groups in
                  the catalog.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {content.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`rounded-2xl border border-fix-border/15 bg-fix-bg-muted p-4 ${getShopEmphasisClasses(shopKey).border}`}
                    >
                      <div className="text-sm font-semibold text-fix-heading">{cat.name}</div>
                      <div className="mt-1 text-sm text-fix-text-muted">{cat.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {hasComingSoon ? (
              <div className="mt-8">
                <Card className="p-6">
                  <div className="text-sm font-semibold text-fix-heading">Coming soon</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {features.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-2xl border border-fix-border/15 bg-fix-surface p-4"
                      >
                        <div className="text-sm font-semibold text-fix-heading">{f.title}</div>
                        <div className="mt-1 text-sm text-fix-text-muted">{f.description}</div>
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
      ) : null}
    </div>
  );
}
