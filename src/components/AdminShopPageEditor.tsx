"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormFeedback } from "@/components/ui/FormFeedback";

type FormState = {
  name: string;
  tagline: string;
  description: string;
  categoriesJson: string;
  featureSectionsJson: string;
};

export function AdminShopPageEditor({
  shopSlug,
  shopName,
}: {
  shopSlug: string;
  shopName: string;
}) {
  const [form, setForm] = useState<FormState | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/page`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setForm(data.form);
      setHasSaved(!!data.hasSavedOverrides);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [shopSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/page`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          description: form.description,
          categoriesJson: form.categoriesJson,
          featureSectionsJson: form.featureSectionsJson,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Save failed");
      setSuccess("Saved.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefaults() {
    if (!confirm("Remove all saved shop page content from the database for this shop?")) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/shops/${shopSlug}/page`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Reset failed");
      setSuccess("Saved content cleared.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <Card className="p-6">
        <p className="text-sm text-fix-text-muted">Loading shop page…</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fix-heading">Shop landing page</h2>
          <p className="mt-1 text-sm text-fix-text-muted">
            {shopName} — public page at{" "}
            <a className="text-fix-link hover:text-fix-link-hover" href={`/shops/${shopSlug}`}>
              /shops/{shopSlug}
            </a>
          </p>
          {hasSaved ? (
            <p className="mt-1 text-xs text-fix-text-muted">Custom overrides are active.</p>
          ) : (
            <p className="mt-1 text-xs text-fix-text-muted">
              No saved landing content yet — categories and Coming soon are empty until you save. Featured
              items are always the newest published products from this shop&apos;s catalog.
            </p>
          )}
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={resetToDefaults}>
          Clear saved page
        </Button>
      </div>

      <form onSubmit={save} className="space-y-4">
        <FormFeedback success={success} error={error} />
        <div>
          <label className="block text-sm font-medium text-fix-text">Shop name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
            className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fix-text">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm((f) => (f ? { ...f, tagline: e.target.value } : f))}
            className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fix-text">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
            className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fix-text">Categories (JSON)</label>
          <textarea
            rows={8}
            value={form.categoriesJson}
            onChange={(e) => setForm((f) => (f ? { ...f, categoriesJson: e.target.value } : f))}
            className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 font-mono text-xs text-fix-text"
          />
          <p className="mt-1 text-xs text-fix-text-muted">
            Array of objects with id, name, and description.
          </p>
        </div>
        <div className="rounded-xl border border-fix-border/15 bg-fix-bg-muted/60 px-4 py-3 text-sm text-fix-text-muted">
          <span className="font-medium text-fix-heading">Featured items</span> on the public shop page are
          the six most recently created <strong className="text-fix-text">published</strong> listings in
          this shop&apos;s catalog (not edited here).
        </div>
        <div>
          <label className="block text-sm font-medium text-fix-text">Coming soon cards (JSON)</label>
          <textarea
            rows={8}
            value={form.featureSectionsJson}
            onChange={(e) => setForm((f) => (f ? { ...f, featureSectionsJson: e.target.value } : f))}
            className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 font-mono text-xs text-fix-text"
          />
          <p className="mt-1 text-xs text-fix-text-muted">
            Array of objects with title, description, href, cta.
          </p>
        </div>
        <Button type="submit" variant="cta" size="sm" disabled={saving}>
          {saving ? "Saving…" : "Save shop page"}
        </Button>
      </form>
    </Card>
  );
}
