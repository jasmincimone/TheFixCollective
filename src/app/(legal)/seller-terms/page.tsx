import { Container } from "@/components/Container";

export const metadata = {
  title: "Seller terms",
};

export default function SellerTermsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          RootSync Seller Terms (Plain Language)
        </h1>
        <p className="mt-6 text-base leading-relaxed text-fix-text-muted">
          RootSync is a platform where growers, makers, and educators can sell directly to their
          community. When you sell on RootSync, you are running your own business&mdash;we simply
          provide the tools.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">You&apos;re Responsible For</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-fix-text-muted">
            <li>Your products and services</li>
            <li>Accurate listings and pricing</li>
            <li>Shipping or delivering orders</li>
            <li>Handling refunds and customer support</li>
            <li>Following all laws (especially food and agriculture laws)</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">What You Can&apos;t Sell</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-fix-text-muted">
            <li>Illegal or unsafe products</li>
            <li>Fake or misleading items</li>
            <li>Anything making unverified health claims</li>
            <li>Counterfeit or stolen goods</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">Payments</h2>
          <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">
            Depending on setup, you may get paid directly or through the platform. Details will
            always be clear before you sell.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">Reviews Matter</h2>
          <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">
            Customers can leave reviews. Keep it real: no fake reviews and no pressuring customers.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">We Keep the Platform Safe</h2>
          <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">
            We may remove listings, accounts, or content if it violates our rules or values.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-fix-heading">The Big Idea</h2>
          <p className="mt-3 text-sm leading-relaxed text-fix-text-muted">
            RootSync is about community, transparency, sustainability, and empowerment. If
            you&apos;re here, you&apos;re building something real&mdash;and we&apos;re here to support
            that.
          </p>
        </section>
      </div>
    </Container>
  );
}
