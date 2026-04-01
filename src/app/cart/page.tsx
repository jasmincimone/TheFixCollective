import { Container } from "@/components/Container";
import { CartContent } from "@/components/CartContent";

export const metadata = {
  title: "Cart",
  description: "Your cart at The Fix Collective",
};

export default function CartPage() {
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
        Cart
      </h1>
      <p className="mt-2 text-fix-text-muted">
        Review your items and proceed to checkout.
      </p>
      <div className="mt-8">
        <CartContent />
      </div>
    </Container>
  );
}
