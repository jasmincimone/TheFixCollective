import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Downloads"
};

export default function DownloadsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Digital downloads
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Templates, checklists, patterns, and guides. (Placeholder for the
          digital library and purchase flow.)
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Library + search
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Filters, tags, and collections across all shops.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Secure access
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Purchased content, account access, and downloads.
          </p>
        </Card>
      </div>
    </Container>
  );
}

