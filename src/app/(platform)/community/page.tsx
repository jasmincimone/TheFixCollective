import type { Prisma } from "@prisma/client";
import { CommunityPostRoleBadge } from "@/components/CommunityPostRoleBadge";
import { Container } from "@/components/Container";
import { CommunityPostForm } from "@/components/CommunityPostForm";
import { MessageUserLink } from "@/components/MessageUserLink";
import { Card } from "@/components/ui/Card";
import { formatCommunityDate, formatCommunityDateTime } from "@/lib/formatCommunityDate";
import { prisma } from "@/lib/prisma";

type CommunityPostWithAuthor = Prisma.CommunityPostGetPayload<{
  include: {
    author: { select: { id: true; name: true; email: true; role: true } };
  };
}>;

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community",
};

export default async function CommunityPage() {
  let posts: CommunityPostWithAuthor[] = [];
  let dbError: string | null = null;
  try {
    posts = await prisma.communityPost.findMany({
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    console.error("Community feed DB error:", e);
    posts = [];
    dbError =
      "Database not ready or migrations missing. From the project root run: npm run db:migrate";
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Community
        </h1>
        <p className="mt-3 text-base text-fix-text-muted">
          Discussions, events, and updates from The Fix Collective. Vendors show a badge when approved.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-8">
        <CommunityPostForm />

        {dbError ? (
          <Card className="border-bark/30 bg-fix-bg-muted p-5">
            <p className="text-sm font-medium text-bark">{dbError}</p>
            <p className="mt-2 text-xs text-fix-text-muted">
              Ensure <code className="rounded bg-fix-surface px-1 py-0.5">DATABASE_URL</code> in{" "}
              <code className="rounded bg-fix-surface px-1 py-0.5">.env.local</code> points at your SQLite file
              (see <code className="rounded bg-fix-surface px-1 py-0.5">.env.example</code>).
            </p>
          </Card>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fix-text-muted">Feed</h2>
          {posts.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-fix-text-muted">No posts yet. Be the first to share!</p>
            </Card>
          ) : (
            <ul className="space-y-4">
              {posts.map((p) => (
                <li key={p.id}>
                  <Card className="p-5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <CommunityPostRoleBadge
                        roleAtPost={p.roleAtPost}
                        showVendorBadge={p.showVendorBadge}
                        authorRole={p.author.role}
                      />
                      <span className="text-sm font-medium text-fix-heading">
                        {p.author.name || p.author.email || "Member"}
                      </span>
                      <MessageUserLink targetUserId={p.author.id} />
                      <span className="text-xs text-fix-text-muted">
                        <span>{formatCommunityDate(p.createdAt.toISOString())}</span>
                        {p.editedAt ? (
                          <>
                            <span className="mx-1.5">·</span>
                            <span>Edited {formatCommunityDateTime(p.editedAt.toISOString())}</span>
                          </>
                        ) : null}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fix-text">
                      {p.content}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
