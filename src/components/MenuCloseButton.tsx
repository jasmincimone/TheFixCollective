"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const btnClass =
  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-fix-text-muted hover:bg-fix-bg-muted hover:text-fix-heading";

type Props = {
  /** Extra classes for the header Close control */
  className?: string;
};

/** Returns to the previous route (e.g. the page open before /menu). Falls back to home if there is no history. */
export function MenuCloseButton({ className = "" }: Props) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`${btnClass} ${className}`.trim()}
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Close
    </button>
  );
}

/** Full-bleed backdrop that closes the menu by navigating back (same behavior as MenuCloseButton). */
export function MenuBackdropClose() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="min-h-0 min-w-0 flex-1 cursor-default bg-espresso/50"
      aria-label="Close menu"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    />
  );
}
