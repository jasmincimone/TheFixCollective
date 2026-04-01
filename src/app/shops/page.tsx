import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { SHOPS } from "@/config/shops";

export const metadata = {
  title: "Shops"
};

export default function ShopsIndexPage() {
  return (
    <div>
      <section className="border-b border-fix-border/15">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
            Shops
          </h1>
          <p className="mt-3 max-w-2xl text-base text-fix-text-muted">
            Four distinct shops under one brand—each with its own focus, all
            sharing the same platform.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {SHOPS.map((shop) => (
              <Card key={shop.slug} className="p-6">
                <div className="text-sm font-semibold text-fix-heading">
                  {shop.name}
                </div>
                <div className="mt-1 text-sm text-fix-text-muted">{shop.tagline}</div>
                <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">
                  {shop.description}
                </p>
                <div className="mt-5">
                  <ButtonLink
                    href={`/shops/${shop.slug}`}
                    variant="secondary"
                    size="sm"
                  >
                    Visit shop
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

