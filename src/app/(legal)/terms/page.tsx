import { Container } from "@/components/Container";

export const metadata = {
  title: "Terms"
};

export default function TermsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Terms of service
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Placeholder terms page.
        </p>
      </div>
    </Container>
  );
}

