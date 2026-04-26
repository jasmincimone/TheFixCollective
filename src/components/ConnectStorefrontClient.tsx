"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";

type ProductCard = {
  id: string;
  name: string;
  description: string | null;
  images?: string[];
  default_price?: {
    unit_amount: number | null;
    currency: string | null;
  } | null;
};

export function ConnectStorefrontClient({
  accountId,
  products,
}: {
  accountId: string;
  products: ProductCard[];
}) {
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function buyProduct(productId: string) {
    setLoadingProductId(productId);
    setError("");
    try {
      const res = await fetch("/api/connect/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, productId, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start checkout.");
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Could not start checkout.");
    } finally {
      setLoadingProductId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const amount =
            product.default_price?.unit_amount != null ? formatPrice(product.default_price.unit_amount) : "Price not set";
          const image = product.images?.[0];
          return (
            <Card key={product.id} className="p-5">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={product.name}
                  className="h-40 w-full rounded-xl bg-fix-bg-muted object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-xl bg-fix-bg-muted text-sm text-fix-text-muted">
                  No image
                </div>
              )}
              <h2 className="mt-4 text-lg font-semibold text-fix-heading">{product.name}</h2>
              <p className="mt-1 text-sm text-fix-text-muted">{product.description || "No description yet."}</p>
              <p className="mt-3 text-base font-semibold text-fix-heading">{amount}</p>
              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-fix-cta px-4 text-sm font-medium text-fix-cta-foreground hover:opacity-90 disabled:opacity-50"
                disabled={loadingProductId === product.id}
                onClick={() => void buyProduct(product.id)}
              >
                {loadingProductId === product.id ? "Redirecting..." : "Buy with Checkout"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
