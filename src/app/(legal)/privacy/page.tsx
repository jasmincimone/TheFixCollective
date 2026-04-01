import { Container } from "@/components/Container";

export const metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Placeholder privacy policy page.
        </p>
      </div>
    </Container>
  );
}

