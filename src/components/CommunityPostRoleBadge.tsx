import { ROLES } from "@/lib/roles";

type Props = {
  roleAtPost: string;
  showVendorBadge: boolean;
  authorRole: string | null | undefined;
};

export function CommunityPostRoleBadge({ roleAtPost, showVendorBadge, authorRole }: Props) {
  const isAdmin = roleAtPost === ROLES.ADMIN || authorRole === ROLES.ADMIN;
  if (isAdmin) {
    return (
      <span className="rounded-full bg-forest/15 px-2 py-0.5 text-xs font-semibold text-forest">
        Admin
      </span>
    );
  }
  if (showVendorBadge || roleAtPost === "VENDOR") {
    return (
      <span className="rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold text-bark">
        Vendor
      </span>
    );
  }
  return (
    <span className="rounded-full bg-fix-border/15 px-2 py-0.5 text-xs font-medium text-fix-text-muted">
      Member
    </span>
  );
}
