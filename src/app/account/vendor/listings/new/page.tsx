"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { VendorListingImageField } from "@/components/VendorListingImageField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LISTING_STATUS } from "@/lib/roles";

export default function NewVendorListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [status, setStatus] = useState<string>(LISTING_STATUS.DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cents = Math.round(parseFloat(priceDollars || "0") * 100);
    if (!title.trim() || !description.trim() || cents < 0 || Number.isNaN(cents)) {
      setError("Check title, description, and price.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priceCents: cents,
          category: category || undefined,
          imageUrl: imageUrl || undefined,
          paymentUrl: paymentUrl.trim() || null,
          productUrl: productUrl.trim() || null,
          status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed");
        setSaving(false);
        return;
      }
      router.push("/account/vendor/listings");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold text-fix-heading">New listing</h2>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="text-sm text-bark">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-fix-text">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Description *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
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
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <VendorListingImageField
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            disabled={saving}
          />
          <div>
            <label className="block text-sm font-medium text-fix-text">
              Payment link (optional)
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              placeholder="https://buy.stripe.com/… or other checkout URL"
              value={paymentUrl}
              onChange={(e) => setPaymentUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
            <p className="mt-1 text-xs text-fix-text-muted">
              Shown on the public marketplace when set. Use a Stripe Payment Link or any secure
              https checkout URL.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">
              Product link (optional)
            </label>
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              placeholder="https://… your shop, catalog, or product page"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
            <p className="mt-1 text-xs text-fix-text-muted">
              Use when you don&apos;t use a payment link, or add both: customers see checkout first,
              then your product page.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-fix-text">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            >
              <option value={LISTING_STATUS.DRAFT}>Draft</option>
              <option value={LISTING_STATUS.PUBLISHED}>Published</option>
              <option value={LISTING_STATUS.ARCHIVED}>Archived</option>
            </select>
          </div>
          <Button type="submit" disabled={saving} variant="cta" size="sm">
            {saving ? "Saving…" : "Create listing"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
