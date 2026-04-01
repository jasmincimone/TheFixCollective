"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";

type Props = {
  productId: string;
  selections?: Record<string, string>;
  variant?: "cta" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({
  productId,
  selections,
  variant = "cta",
  size = "md",
  className,
  children,
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(productId, 1, selections);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sizeClass =
    size === "sm"
      ? "h-9 px-3 text-sm"
      : size === "lg"
        ? "h-11 px-5 text-base"
        : "h-10 px-4 text-sm";
  const variantClass =
    variant === "cta"
      ? "bg-fix-cta text-fix-cta-foreground hover:opacity-90"
      : "bg-fix-surface text-fix-heading ring-1 ring-fix-border/20 hover:bg-fix-bg-muted";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-clay disabled:opacity-70",
        sizeClass,
        variantClass,
        className
      )}
      disabled={added}
    >
      {added ? (
        "Added to cart"
      ) : (
        <>
          {children ?? (
            <>
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Add to cart
            </>
          )}
        </>
      )}
    </button>
  );
}
