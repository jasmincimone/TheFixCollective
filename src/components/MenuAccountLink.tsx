"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  /** e.g. close mobile menu overlay when navigating */
  onNavigate?: () => void;
};

export function MenuAccountLink({ onNavigate }: Props) {
  const { data: session, status } = useSession();

  const href =
    status === "loading" || session
      ? "/account"
      : "/login?callbackUrl=/account";

  const label =
    status === "loading" ? "Account" : session ? "My account" : "Sign in";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-xl border border-fix-border/15 bg-fix-surface px-3 py-2.5 text-sm font-semibold text-fix-heading hover:bg-fix-bg-muted"
    >
      {label}
    </Link>
  );
}
