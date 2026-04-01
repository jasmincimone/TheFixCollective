import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/lib/permissions";

export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    redirect("/account");
  }
  return <>{children}</>;
}
