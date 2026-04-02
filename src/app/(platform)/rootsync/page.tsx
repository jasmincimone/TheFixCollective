import { Container } from "@/components/Container";
import { RootSyncChat } from "@/components/RootSyncChat";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "RootSync AI",
};

export default function RootSyncPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          RootSync AI
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Your AI guide for growing, eating well, and planning a resilient food
          business—rooted in farming, gardening, and healthy food.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Ask RootSync
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Chat below for crop plans, soil tips, nutrition ideas, and small-farm
            business questions—powered by OpenAI.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Personalized plans
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Saves your context, goals, and preferences (with clear privacy
            controls).
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Shop-aware recommendations
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Suggests products, downloads, and courses across the four shops.
          </p>
        </Card>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <RootSyncChat />
      </div>
    </Container>
  );
}

