import Link from "next/link";

import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyNowLink } from "@/components/BuyNowLink";
import { ProductImage } from "@/components/ProductImage";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";
import { getStripePaymentLink } from "@/lib/paymentLinks";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const paymentLink = getStripePaymentLink(product);
  return (
    <Card className="overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className={`block overflow-hidden bg-fix-bg-muted ${
          product.imageFit === "contain" ? "aspect-square" : "aspect-[4/3]"
        }`}
        aria-label={product.name}
      >
        <ProductImage
          shop={product.shop}
          productId={product.id}
          src={product.image}
          fit={product.imageFit ?? "cover"}
          placeholderText={product.type === "digital" ? "Digital" : "Product"}
          className="h-full w-full"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.id}`}
              className="font-semibold text-fix-heading hover:text-fix-link hover:underline"
            >
              {product.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-fix-text-muted">
              {product.summary}
            </p>
          </div>
          {product.badge ? (
            <span className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-bark">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-fix-heading">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full bg-fix-border/15 px-2 py-0.5 text-xs font-medium text-fix-text-muted">
            {product.type === "digital" ? (product.format ? `${product.format} • Digital` : "Digital") : "Physical"}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {paymentLink ? (
            <>
              <BuyNowLink href={paymentLink} size="sm" className="flex-1" />
              <AddToCartButton productId={product.id} size="sm" variant="secondary" className="flex-1" />
            </>
          ) : (
            <AddToCartButton productId={product.id} size="sm" className="flex-1" />
          )}
          <Link
            href={`/products/${product.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-fix-border/20 bg-fix-surface text-sm font-medium text-fix-heading hover:bg-fix-bg-muted"
          >
            View
          </Link>
        </div>
      </div>
    </Card>
  );
}
