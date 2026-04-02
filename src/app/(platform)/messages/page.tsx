import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Messages",
};

function pickWithParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return undefined;
}

export default function MessagesLandingPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const withV = pickWithParam(searchParams.with);
  const withU = pickWithParam(searchParams.withUser);
  if (withV || withU) {
    const q = new URLSearchParams();
    if (withV) q.set("with", withV);
    if (withU) q.set("withUser", withU);
    redirect(`/messages/inbox?${q.toString()}`);
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fix-heading sm:text-3xl">Messages</h1>
          <p className="mt-2 text-sm text-fix-text-muted">
            Chat with marketplace vendors and people you connect with through the community. Open the
            messages platform to view threads and start new conversations.
          </p>
          <div className="mt-4">
            <ButtonLink href="/messages/inbox" variant="secondary" size="sm">
              Open messages platform
            </ButtonLink>
          </div>
        </div>
        <p className="text-xs text-fix-text-muted">
          Deep links from the community (e.g. message a vendor) go straight to the inbox with the right
          context.
        </p>
        <p className="text-sm text-fix-text-muted">
          Prefer the full feed?{" "}
          <Link href="/community" className="font-medium text-fix-link hover:text-fix-link-hover">
            Visit Community
          </Link>
        </p>
      </div>
    </Container>
  );
}
