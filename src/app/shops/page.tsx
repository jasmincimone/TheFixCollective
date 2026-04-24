import { Container } from "@/components/Container";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
import { ShopLogo } from "@/components/ShopLogo";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { AMARA_KIT_CATALOG_ID } from "@/config/featuredCatalog";
import { SHOPS } from "@/config/shops";
import { getMergedProductForPublic } from "@/lib/shopCatalog";

export const metadata = {
  title: "The Fix Shops",
};

export const dynamic = "force-dynamic";

export default async function ShopsIndexPage() {
  const amaraKit = await getMergedProductForPublic(AMARA_KIT_CATALOG_ID);

  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
            The Fix Shops
          </h1>
          <p className="mt-3 max-w-2xl text-base text-fix-text-muted">
            Four distinct shops under one brand—each with its own focus, all sharing the same platform.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          {amaraKit ? (
            <div className="mx-auto mb-10 w-full max-w-sm">
              <FeaturedListingCard product={amaraKit} className="mt-0" />
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {SHOPS.map((shop) => {
              const shortName = shop.name.replace("The Fix ", "");
              return (
                <Card key={shop.slug} className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-fix-border/30 bg-fix-bg-muted">
                      <ShopLogo
                        shopSlug={shop.slug}
                        shopDisplayName={shortName}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <div className="mt-4 text-sm font-semibold leading-tight text-fix-heading">{shortName}</div>
                    <div className="mt-1 text-sm text-fix-text-muted">{shop.tagline}</div>
                    <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">{shop.description}</p>
                    <div className="mt-5">
                      <ButtonLink href={`/shops/${shop.slug}`} variant="secondary" size="sm">
                        Visit shop
                      </ButtonLink>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
