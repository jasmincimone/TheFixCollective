"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { VendorListingImageField } from "@/components/VendorListingImageField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormFeedback } from "@/components/ui/FormFeedback";
import { SHOP_CONTENT, type ShopSlug } from "@/config/shops";
import { getProduct } from "@/data/products";
import { LISTING_STATUS } from "@/lib/roles";

export function AdminShopCatalogListingForm({
  shopSlug,
  listingId,
  prefillSeedProductId,
}: {
  shopSlug: string;
  listingId?: string;
  /** When creating a row, prefill from built-in seed product (same id = override). */
  prefillSeedProductId?: string;
}) {
  const router = useRouter();
  const isEdit = !!listingId;
  const shopKey = shopSlug as ShopSlug;
  const categories = SHOP_CONTENT[shopKey]?.categories ?? [];

  const [customId, setCustomId] = useState("");
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [type, setType] = useState<"physical" | "digital">("physical");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFit, setImageFit] = useState<"cover" | "contain" | "">("");
  const [badge, setBadge] = useState("");
  const [format, setFormat] = useState("");
  const [optionsJson, setOptionsJson] = useState("");
  const [stripePaymentLink, setStripePaymentLink] = useState("");
  const [status, setStatus] = useState<string>(LISTING_STATUS.DRAFT);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const seedPrefillDone = useRef(false);

  const backHref = `/account/admin/shops/${shopSlug}`;

  const load = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/listings/${listingId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const l = data.listing;
      setName(l.name);
      setSummary(l.summary);
      setDescription(l.description);
      setPriceDollars((l.priceCents / 100).toFixed(2));
      setType(l.type === "digital" ? "digital" : "physical");
      setCategoryId(l.categoryId ?? "");
      setImageUrl(l.imageUrl ?? "");
      setImageFit(l.imageFit === "contain" ? "contain" : l.imageFit === "cover" ? "cover" : "");
      setBadge(l.badge ?? "");
      setFormat(l.format ?? "");
      setOptionsJson(l.optionsJson ?? "");
      setStripePaymentLink(l.stripePaymentLink ?? "");
      setStatus(l.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [listingId, shopSlug]);

  useEffect(() => {
    if (isEdit) load();
  }, [isEdit, load]);

  useEffect(() => {
    if (isEdit || seedPrefillDone.current || !prefillSeedProductId) return;
    const p = getProduct(prefillSeedProductId);
    if (!p || p.shop !== shopSlug) return;
    seedPrefillDone.current = true;
    setCustomId(p.id);
    setName(p.name);
    setSummary(p.summary);
    setDescription(p.description);
    setPriceDollars((p.price / 100).toFixed(2));
    setType(p.type === "digital" ? "digital" : "physical");
    setCategoryId(p.categoryId);
    setImageUrl(p.image ?? "");
    setImageFit(p.imageFit === "contain" ? "contain" : p.imageFit === "cover" ? "cover" : "");
    setBadge(p.badge ?? "");
    setFormat(p.format ?? "");
    setOptionsJson(p.options?.length ? JSON.stringify(p.options, null, 2) : "");
    setStripePaymentLink(p.stripePaymentLink ?? "");
  }, [isEdit, prefillSeedProductId, shopSlug]);

  useEffect(() => {
    if (isEdit || prefillSeedProductId) return;
    const cats = SHOP_CONTENT[shopKey]?.categories ?? [];
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
  }, [isEdit, shopKey, categoryId, prefillSeedProductId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cents = Math.round(parseFloat(priceDollars || "0") * 100);
    if (!name.trim() || !summary.trim() || !description.trim()) {
      setError("Name, summary, and description are required.");
      return;
    }
    if (cents < 0 || Number.isNaN(cents)) {
      setError("Enter a valid price.");
      return;
    }
    if (!categoryId.trim()) {
      setError("Choose a category.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && listingId) {
        const res = await fetch(`/api/admin/shops/${shopSlug}/listings/${listingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            summary,
            description,
            priceCents: cents,
            type,
            categoryId,
            imageUrl: imageUrl || null,
            imageFit: imageFit || null,
            badge: badge || null,
            format: format || null,
            optionsJson: optionsJson || null,
            stripePaymentLink: stripePaymentLink.trim() || null,
            status,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Save failed");
        setSuccess("Saved.");
        window.setTimeout(() => {
          router.push(backHref);
          router.refresh();
        }, 600);
      } else {
        const res = await fetch(`/api/admin/shops/${shopSlug}/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: customId.trim() || undefined,
            name,
            summary,
            description,
            priceCents: cents,
            type,
            categoryId,
            imageUrl: imageUrl || null,
            imageFit: imageFit || null,
            badge: badge || null,
            format: format || null,
            optionsJson: optionsJson || null,
            stripePaymentLink: stripePaymentLink.trim() || null,
            status,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Create failed");
        setSuccess("Created.");
        window.setTimeout(() => router.push(backHref), 600);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function removeListing() {
    if (!isEdit || !listingId) return;
    if (!confirm("Delete this listing from the database? Built-in seed products are unchanged.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/listings/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Delete failed");
      router.push(backHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-fix-text-muted">Loading…</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-fix-heading">
          {isEdit ? "Edit catalog listing" : "New catalog listing"}
        </h2>
        <Button type="button" variant="secondary" size="sm" onClick={() => router.push(backHref)}>
          Back
        </Button>
      </div>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <FormFeedback success={success} error={error} />
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-fix-text">
                Product id (optional — match a built-in id to override)
              </label>
              <input
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="e.g. ur-starter-bed-kit"
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 font-mono text-sm text-fix-text"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-fix-text">Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Summary *</label>
            <input
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Description *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Price (USD) *</label>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "physical" | "digital")}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Category *</label>
            {categories.length > 0 ? (
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                placeholder="category id"
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 font-mono text-sm text-fix-text"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Image fit (when using image URL)</label>
            <select
              value={imageFit}
              onChange={(e) => setImageFit(e.target.value as "" | "cover" | "contain")}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            >
              <option value="">Default (cover)</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
          <VendorListingImageField imageUrl={imageUrl} onImageUrlChange={setImageUrl} disabled={saving} />
          <div>
            <label className="block text-sm font-medium text-fix-text">Badge (optional)</label>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Format (digital, optional)</label>
            <input
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="PDF"
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Options (JSON, optional)</label>
            <textarea
              rows={4}
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              placeholder='[{"id":"seed","label":"Seed choice","choices":[...]}]'
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 font-mono text-xs text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Stripe payment link (optional)</label>
            <input
              type="text"
              inputMode="url"
              value={stripePaymentLink}
              onChange={(e) => setStripePaymentLink(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
            >
              <option value={LISTING_STATUS.DRAFT}>Draft</option>
              <option value={LISTING_STATUS.PUBLISHED}>Published</option>
              <option value={LISTING_STATUS.ARCHIVED}>Archived</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="cta" size="sm" disabled={saving || !!success}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create listing"}
            </Button>
            {isEdit ? (
              <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={removeListing}>
                Delete
              </Button>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
