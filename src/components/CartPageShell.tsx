"use client";

import { CartBackdropClose, CartCloseButton } from "@/components/CartCloseButton";
import { CartContent } from "@/components/CartContent";

export function CartPageShell() {
  return (
    <div className="flex min-h-0 flex-1 flex-row">
      <CartBackdropClose />
      <aside className="flex h-full min-h-0 w-[min(100%,420px)] min-w-[260px] shrink-0 flex-col overflow-y-auto border-l border-fix-border/15 bg-fix-surface sm:min-w-[300px]">
        <div className="flex min-h-0 flex-1 flex-col py-6 pl-4 pr-6">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-semibold text-fix-heading">Cart</h1>
            <CartCloseButton />
          </div>
          <p className="mt-2 text-sm text-fix-text-muted">
            Review your items and proceed to checkout.
          </p>
          <div className="mt-6 min-h-0 flex-1">
            <CartContent />
          </div>
        </div>
      </aside>
    </div>
  );
}
