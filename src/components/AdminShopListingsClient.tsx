"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";

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

type SeedSummary = {
  id: string;
  name: string;
  summary: string;
  priceCents: number;
  type: string;
  categoryId: string;
  imageUrl: string | null;
};

type CatalogItem =
  | { rowKind: "built-in"; seed: SeedSummary; dbListing: DbListing | null }
  | { rowKind: "database-only"; dbListing: DbListing };

export function AdminShopListingsClient({ shopSlug }: { shopSlug: string }) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/listings`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setItems(Array.isArray(data.items) ? data.items : []);
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
            <strong className="font-medium text-fix-heading">Built-in</strong> rows come from the product
            seed file in code (what shoppers see by default).{" "}
            <strong className="font-medium text-fix-heading">Database</strong> rows override or add products
            when published. Use &quot;Add database row&quot; to create an override with the same product id.
          </p>
        </div>
        <ButtonLink href={`${base}/new`} variant="cta" size="sm">
          New listing
        </ButtonLink>
      </div>

      {error && <p className="text-sm text-bark">{error}</p>}
      {loading ? (
        <p className="text-sm text-fix-text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-fix-text-muted">No products configured for this shop.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((row) => {
            if (row.rowKind === "database-only") {
              const l = row.dbListing;
              return (
                <li key={`db-${l.id}`}>
                  <CatalogRowCard
                    title={l.name}
                    meta={`${l.status} • ${l.type} • ${formatPrice(l.priceCents)} • ${l.categoryId}`}
                    idLine={l.id}
                    imageUrl={l.imageUrl}
                    badge="Database only"
                    badgeClass="bg-forest/15 text-forest"
                    actionHref={`${base}/${l.id}/edit`}
                    actionLabel="Edit"
                  />
                </li>
              );
            }

            const { seed, dbListing } = row;
            const thumb = dbListing?.imageUrl ?? seed.imageUrl;
            if (dbListing) {
              return (
                <li key={`seed-${seed.id}`}>
                  <CatalogRowCard
                    title={dbListing.name}
                    meta={`${dbListing.status} • ${dbListing.type} • ${formatPrice(dbListing.priceCents)} • ${dbListing.categoryId}`}
                    idLine={dbListing.id}
                    imageUrl={thumb}
                    badge="Overrides built-in"
                    badgeClass="bg-amber/20 text-espresso"
                    subNote={`Built-in: ${seed.name}`}
                    actionHref={`${base}/${dbListing.id}/edit`}
                    actionLabel="Edit override"
                  />
                </li>
              );
            }

            return (
              <li key={`seed-${seed.id}`}>
                <CatalogRowCard
                  title={seed.name}
                  meta={`Built-in • ${seed.type} • ${formatPrice(seed.priceCents)} • ${seed.categoryId}`}
                  idLine={seed.id}
                  imageUrl={thumb}
                  badge="Built-in (code)"
                  badgeClass="bg-fix-border/15 text-fix-text-muted"
                  actionHref={`${base}/new?fromSeed=${encodeURIComponent(seed.id)}`}
                  actionLabel="Add database row"
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
  subNote,
  actionHref,
  actionLabel,
}: {
  title: string;
  meta: string;
  idLine: string;
  imageUrl: string | null;
  badge: string;
  badgeClass: string;
  subNote?: string;
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
          {subNote ? <div className="text-xs text-fix-text-muted">{subNote}</div> : null}
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
