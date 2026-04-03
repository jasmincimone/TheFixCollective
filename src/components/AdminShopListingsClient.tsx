"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";
import { LISTING_STATUS } from "@/lib/roles";

type DbListing = {
  id: string;
  name: string;
  status: string;
  priceCents: number;
  updatedAt: string;
  imageUrl: string | null;
  type: string;
  categoryId: string;
};

function listingBadge(status: string): { label: string; badgeClass: string } {
  if (status === LISTING_STATUS.PUBLISHED) {
    return { label: "Published", badgeClass: "bg-forest/15 text-forest" };
  }
  if (status === LISTING_STATUS.ARCHIVED) {
    return { label: "Archived", badgeClass: "bg-fix-border/15 text-fix-text-muted" };
  }
  return { label: "Draft", badgeClass: "bg-amber/20 text-espresso" };
}

export function AdminShopListingsClient({ shopSlug }: { shopSlug: string }) {
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/listings`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setListings(Array.isArray(data.listings) ? data.listings : []);
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
            Products shown on the storefront come from these database rows. Set status to{" "}
            <strong className="font-medium text-fix-heading">Published</strong> when ready for shoppers.
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
          <p className="text-sm text-fix-text-muted">No listings yet. Create one to appear in the shop catalog.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => {
            const { label, badgeClass } = listingBadge(l.status);
            return (
              <li key={l.id}>
                <CatalogRowCard
                  title={l.name}
                  meta={`${l.type} • ${formatPrice(l.priceCents)} • ${l.categoryId}`}
                  idLine={l.id}
                  imageUrl={l.imageUrl}
                  badge={label}
                  badgeClass={badgeClass}
                  actionHref={`${base}/${l.id}/edit`}
                  actionLabel="Edit"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CatalogRowCard({
  title,
  meta,
  idLine,
  imageUrl,
  badge,
  badgeClass,
  actionHref,
  actionLabel,
}: {
  title: string;
  meta: string;
  idLine: string;
  imageUrl: string | null;
  badge: string;
  badgeClass: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-fix-border/20 bg-fix-bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin thumb URL or static path
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-fix-text-muted/60" strokeWidth={1.5} aria-hidden />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-fix-heading">{title}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}>{badge}</span>
          </div>
          <div className="text-xs text-fix-text-muted">{meta}</div>
          <div className="font-mono text-xs text-fix-text-muted">id: {idLine}</div>
        </div>
      </div>
      <Link
        href={actionHref}
        className="text-sm font-medium text-fix-link hover:text-fix-link-hover"
      >
        {actionLabel}
      </Link>
    </Card>
  );
}
