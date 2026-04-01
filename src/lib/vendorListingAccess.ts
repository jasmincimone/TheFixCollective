import { prisma } from "@/lib/prisma";
import { ROLES, VENDOR_STATUS } from "@/lib/roles";

/** Approved vendor profile + Vendor or Admin role (same rules as listing image upload). */
export function canManageVendorListings(role: string, vendorStatus: string | undefined): boolean {
  if (vendorStatus !== VENDOR_STATUS.APPROVED) return false;
  return role === ROLES.VENDOR || role === ROLES.ADMIN;
}

export async function requireApprovedVendorGate(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vendorProfile: true },
  });
  if (!user?.vendorProfile) return { error: "No vendor profile" as const };
  if (!canManageVendorListings(user.role, user.vendorProfile.status)) {
    return { error: "Not an approved vendor" as const };
  }
  return { vendorProfileId: user.vendorProfile.id };
}
