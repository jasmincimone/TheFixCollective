"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { leaveCart } from "@/lib/cartReturn";

const btnClass =
  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-fix-text-muted hover:bg-fix-bg-muted hover:text-fix-heading";

type Props = {
  className?: string;
};

/** Closes /cart and returns to the page you were on (see rememberPathBeforeCart on the cart link). */
export function CartCloseButton({ className = "" }: Props) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`${btnClass} ${className}`.trim()}
      onClick={() => leaveCart(router)}
    >
      Close
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
    </button>
  );
}

/** Backdrop left of the cart panel; same behavior as CartCloseButton. */
export function CartBackdropClose() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="min-h-0 min-w-0 flex-1 cursor-pointer bg-espresso/50"
      aria-label="Close cart"
      onClick={() => leaveCart(router)}
    />
  );
}
