"use client";

import { useSession } from "next-auth/react";

import { ButtonLink } from "@/components/ui/Button";

type Props = {
  vendorProfileId: string;
  variant?: "primary" | "cta" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function MessageVendorLink({
  vendorProfileId,
  variant = "secondary",
  size = "sm",
  className,
}: Props) {
  const { data: session, status } = useSession();
  const href = `/messages/inbox?with=${encodeURIComponent(vendorProfileId)}`;

  if (status === "loading") {
    return (
      <span
        className={`inline-flex h-9 items-center rounded-full px-3 text-sm text-fix-text-muted ${className ?? ""}`}
      >
        …
      </span>
    );
  }

  if (!session) {
    return (
      <ButtonLink
        href={`/login?callbackUrl=${encodeURIComponent(href)}`}
        variant={variant}
        size={size}
        className={className}
      >
        Message vendor
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href={href} variant={variant} size={size} className={className}>
      Message vendor
    </ButtonLink>
  );
}
