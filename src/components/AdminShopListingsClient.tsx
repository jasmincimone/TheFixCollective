"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";

type Listing = {
  id: string;
  name: string;
  status: string;
  priceCents: number;
  updatedAt: string;
  imageUrl: string | null;
  type: string;
  categoryId: string;
};

export function AdminShopListingsClient({ shopSlug }: { shopSlug: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/listings`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setListings(data.listings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [shopSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const base = `/account/admin/shops/${shopSlug}/listings`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fix-heading">Catalog listings</h2>
          <p className="mt-1 text-sm text-fix-text-muted">
            These products merge with the built-in seed catalog. Use the same product id as a seed item to
            override it, or leave id blank when creating a new product.
          </p>
        </div>
        <ButtonLink href={`${base}/new`} variant="cta" size="sm">
          New listing
        </ButtonLink>
      </div>

      {error && <p className="text-sm text-bark">{error}</p>}
      {loading ? (
        <p className="text-sm text-fix-text-muted">Loading…</p>
      ) : listings.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-fix-text-muted">
            No database listings for this shop yet. The storefront still shows built-in products from code.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <li key={l.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-fix-border/20 bg-fix-bg-muted">
                    {l.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin thumb URL
                      <img
                        src={l.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon
                        className="h-6 w-6 text-fix-text-muted/60"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-fix-heading">{l.name}</div>
                    <div className="text-xs text-fix-text-muted">
                      {l.status} • {l.type} • {formatPrice(l.priceCents)} • {l.categoryId}
                    </div>
                    <div className="font-mono text-xs text-fix-text-muted">id: {l.id}</div>
                  </div>
                </div>
                <Link
                  href={`${base}/${l.id}/edit`}
                  className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
                >
                  Edit
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
