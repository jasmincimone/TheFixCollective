/** Stored in User.role (SQLite string) */
export const ROLES = {
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const VENDOR_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;

export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];

export const LISTING_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ListingStatus = (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];

export function isRole(value: string | undefined | null): value is Role {
  return value === ROLES.ADMIN || value === ROLES.VENDOR || value === ROLES.CUSTOMER;
}

export function toVendorStatus(value: string | null | undefined): VendorStatus | null {
  if (!value) return null;
  const allowed = Object.values(VENDOR_STATUS) as string[];
  return allowed.includes(value) ? (value as VendorStatus) : null;
}
