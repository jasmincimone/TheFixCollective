import type { Session } from "next-auth";
import { ROLES, VENDOR_STATUS, type Role } from "@/lib/roles";

export function getSessionRole(session: Session | null): Role {
  const r = session?.user?.role;
  if (r === ROLES.ADMIN || r === ROLES.VENDOR || r === ROLES.CUSTOMER) return r;
  return ROLES.CUSTOMER;
}

export function isAdmin(session: Session | null): boolean {
  return getSessionRole(session) === ROLES.ADMIN;
}

export function isApprovedVendor(session: Session | null): boolean {
  if (getSessionRole(session) !== ROLES.VENDOR) return false;
  return session?.user?.vendorStatus === VENDOR_STATUS.APPROVED;
}

export function canPostCommunity(session: Session | null): boolean {
  return !!session?.user?.id;
}

export function requireAdmin(session: Session | null): void {
  if (!isAdmin(session)) {
    throw new Error("Forbidden");
  }
}
