import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Courses"
};

export default function CoursesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Courses
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Short, practical learning for growing, caring, making, and readiness.
          (Placeholder for the course catalog and player.)
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Course catalog
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Browse by shop, skill level, and format.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold text-fix-heading">
            Progress + certificates
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Saved progress, completion tracking, and credentials.
          </p>
        </Card>
      </div>
    </Container>
  );
}

