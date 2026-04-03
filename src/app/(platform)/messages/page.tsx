import { redirect } from "next/navigation";

export const metadata = {
  title: "Messages",
};

function pickWithParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return undefined;
}

/** `/messages` forwards to the inbox so bookmarks and deep links keep working. */
export default function MessagesRedirectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const withV = pickWithParam(searchParams.with);
  const withU = pickWithParam(searchParams.withUser);
  const q = new URLSearchParams();
  if (withV) q.set("with", withV);
  if (withU) q.set("withUser", withU);
  const query = q.toString();
  redirect(query ? `/messages/inbox?${query}` : "/messages/inbox");
}
