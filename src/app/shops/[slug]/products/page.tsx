import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { getShop } from "@/config/shops";
import { loadMergedShopDisplay } from "@/lib/shopPageDisplay";
import { getMergedProductsByShopForPublic } from "@/lib/shopCatalog";
import type { ProductType } from "@/types/product";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const shop = getShop(params.slug);
  if (!shop) return {};
  const display = await loadMergedShopDisplay(params.slug);
  const name = display?.name ?? shop.name;
  const tagline = display?.tagline ?? shop.tagline;
  return {
    title: `Products • ${name}`,
    description: `Shop ${name} — ${tagline}`,
  };
}

type SearchParams = { type?: string };

export default async function ShopProductsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const shop = getShop(params.slug);
  if (!shop) notFound();

  const display = await loadMergedShopDisplay(params.slug);
  const shopTitle = display?.name ?? shop.name;
  const shopTagline = display?.tagline ?? shop.tagline;

  const typeFilter = (searchParams?.type === "physical" || searchParams?.type === "digital"
    ? searchParams.type
    : undefined) as ProductType | undefined;

  const allProducts = await getMergedProductsByShopForPublic(shop.slug);
  const products = typeFilter
    ? allProducts.filter((p) => p.type === typeFilter)
    : allProducts;

  const baseUrl = `/shops/${shop.slug}/products`;

  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-8 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav className="text-sm text-fix-text-muted">
                <Link href="/shops" className="text-fix-link hover:text-fix-link-hover">
                  Shops
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/shops/${shop.slug}`} className="text-fix-link hover:text-fix-link-hover">
                  {shopTitle}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-fix-heading">Products</span>
              </nav>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fix-heading sm:text-3xl">
                {shopTitle}
              </h1>
              <p className="mt-1 text-fix-text-muted">{shopTagline}</p>
            </div>
            <ButtonLink href={`/shops/${shop.slug}`} variant="secondary" size="sm">
              Back to shop
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-8">
          {allProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-fix-text-muted">No products in this shop yet.</p>
              <div className="mt-4">
                <ButtonLink href={`/shops/${shop.slug}`} variant="secondary" size="sm">
                  Back to {shopTitle}
                </ButtonLink>
              </div>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2 border-b border-fix-border/15 pb-4">
                <Link
                  href={baseUrl}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    !typeFilter
                      ? "bg-fix-primary text-fix-primary-foreground"
                      : "bg-fix-surface text-fix-heading ring-1 ring-fix-border/20 hover:bg-fix-bg-muted"
                  }`}
                >
                  All ({allProducts.length})
                </Link>
                <Link
                  href={`${baseUrl}?type=physical`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    typeFilter === "physical"
                      ? "bg-fix-primary text-fix-primary-foreground"
                      : "bg-fix-surface text-fix-heading ring-1 ring-fix-border/20 hover:bg-fix-bg-muted"
                  }`}
                >
                  Physical ({allProducts.filter((p) => p.type === "physical").length})
                </Link>
                <Link
                  href={`${baseUrl}?type=digital`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    typeFilter === "digital"
                      ? "bg-fix-primary text-fix-primary-foreground"
                      : "bg-fix-surface text-fix-heading ring-1 ring-fix-border/20 hover:bg-fix-bg-muted"
                  }`}
                >
                  Digital — ebooks & patterns ({allProducts.filter((p) => p.type === "digital").length})
                </Link>
              </div>

              {products.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-fix-text-muted">
                    No {typeFilter === "physical" ? "physical" : "digital"} products in this shop.
                  </p>
                  <div className="mt-4">
                    <Link
                      href={baseUrl}
                      className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
                    >
                      View all products
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
}
