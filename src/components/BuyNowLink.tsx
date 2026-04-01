import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/cn";

type Props = {
  href: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

const sizeClass: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

/** Opens Stripe Payment Link in same tab (Stripe handles redirect back if configured). */
export function BuyNowLink({ href, size = "md", className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        "bg-fix-cta text-fix-cta-foreground hover:opacity-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-clay",
        sizeClass[size],
        className
      )}
    >
      {children ?? (
        <>
          Buy now
          <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        </>
      )}
    </a>
  );
}
