import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "RootSync Platform",
};

export default function PlatformLandingPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          RootSync Platform
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fix-text-muted">
          Learn, connect, and participate in a growing ecosystem of local creators and communities.
          Explore the marketplace, chat with RootSync AI, and engage through community and messaging.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/signup" variant="cta" size="md">
            Sign up
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" size="md">
            About us
          </ButtonLink>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold text-fix-heading">Marketplace</div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Browse local vendor listings, products, and community-first commerce.
          </p>
          <div className="mt-4">
            <ButtonLink href="/marketplace" variant="secondary" size="sm">
              Explore marketplace
            </ButtonLink>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-fix-heading">RootSync AI</div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Get guided support for growing, planning, and local food business workflows.
          </p>
          <div className="mt-4">
            <ButtonLink href="/rootsync" variant="secondary" size="sm">
              Open RootSync AI
            </ButtonLink>
          </div>
        </Card>
      </div>
    </Container>
  );
}
