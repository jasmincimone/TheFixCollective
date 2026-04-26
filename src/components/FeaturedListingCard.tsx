import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  /** Merged onto the outer link (e.g. `mt-0` when not under stacked hero buttons). */
  className?: string;
};

/** Compact featured listing row for landing pages (image + summary + price). */
export function FeaturedListingCard({ product, className }: Props) {
  const href = `/products/${product.id}`;
  const fit = product.imageFit ?? "cover";

  return (
    <Link
      href={href}
      className={cn(
        "group mt-6 block w-full max-w-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fix-cta focus-visible:ring-offset-2",
        className
      )}
    >
      <Card className="overflow-hidden border-amber/35 p-0 shadow-md ring-2 ring-amber/25 transition group-hover:border-amber/50 group-hover:ring-amber/45">
        <div className="grid gap-0 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:items-stretch">
          <div
            className={`relative aspect-square bg-fix-bg-muted sm:aspect-auto sm:min-h-[9.5rem] ${
              fit === "contain" ? "sm:p-2" : ""
            }`}
          >
            <ProductImage
              shop={product.shop}
              productId={product.id}
              src={product.image}
              alt={product.name}
              fit={fit}
              placeholderText={product.type === "digital" ? "Digital product" : "Product image"}
              className="h-full w-full"
            />
          </div>
          <div className="flex flex-col justify-center py-4 pl-8 pr-4 sm:py-5 sm:pl-10 sm:pr-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber">
              Featured listing
            </span>
            <h3 className="mt-1 text-base font-semibold leading-snug text-fix-heading group-hover:text-fix-link sm:text-lg">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fix-text-muted">{product.summary}</p>
            <p className="mt-3 text-lg font-semibold text-fix-heading">{formatPrice(product.price)}</p>
            <span className="mt-1 text-sm font-medium text-fix-link group-hover:text-fix-link-hover">
              View product →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
