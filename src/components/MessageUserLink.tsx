"use client";

import { useSession } from "next-auth/react";

import { ButtonLink } from "@/components/ui/Button";

type Props = {
  targetUserId: string;
  variant?: "primary" | "cta" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Opens or continues a DM with another user (e.g. from a community post author).
 */
export function MessageUserLink({
  targetUserId,
  variant = "ghost",
  size = "sm",
  className,
}: Props) {
  const { data: session, status } = useSession();
  const href = `/messages?withUser=${encodeURIComponent(targetUserId)}`;

  if (status === "loading") {
    return (
      <span
        className={`inline-flex h-8 items-center rounded-full px-2 text-xs text-fix-text-muted ${className ?? ""}`}
      >
        …
      </span>
    );
  }

  if (session?.user?.id === targetUserId) {
    return null;
  }

  if (!session) {
    return (
      <ButtonLink
        href={`/login?callbackUrl=${encodeURIComponent(href)}`}
        variant={variant}
        size={size}
        className={className}
      >
        Message
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href={href} variant={variant} size={size} className={className}>
      Message
    </ButtonLink>
  );
}
