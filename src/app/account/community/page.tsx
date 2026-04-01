import Link from "next/link";
import { getServerSession } from "next-auth";

import { MyCommunityPosts } from "@/components/MyCommunityPosts";
import { ButtonLink } from "@/components/ui/Button";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Community posts",
};

function serializePost(p: {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date | null;
}) {
  return {
    id: p.id,
    content: p.content,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    editedAt: p.editedAt?.toISOString() ?? null,
  };
}

export default async function AccountCommunityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const rows = await prisma.communityPost.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const posts = rows.map(serializePost);
  const listKey = posts.map((p) => `${p.id}:${p.updatedAt}`).join("|");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fix-heading">Community</h2>
        <p className="mt-1 text-sm text-fix-text-muted">
          Your posts on the public feed. Editing bumps a post to the top of this list and the main community
          feed.
        </p>
        <div className="mt-3">
          <ButtonLink href="/community" variant="secondary" size="sm">
            Go to community feed
          </ButtonLink>
        </div>
      </div>

      <MyCommunityPosts key={listKey} posts={posts} />

      <p className="text-xs text-fix-text-muted">
        Want to post something new?{" "}
        <Link href="/community" className="font-medium text-fix-link hover:text-fix-link-hover">
          Open the community
        </Link>
        .
      </p>
    </div>
  );
}
