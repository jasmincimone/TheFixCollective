"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function VendorApplyPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, contactEmail, pickupLocation }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not submit");
        setSubmitting(false);
        return;
      }
      router.push("/account/vendor");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fix-heading">Become a vendor</h2>
        <p className="mt-1 text-sm text-fix-text-muted">
          Tell us about your farm or shop. An admin will review your application.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-bark">{error}</p>}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-fix-text">
              Business / display name *
            </label>
            <input
              id="displayName"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-fix-text">
              About you
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-fix-text">
              Public contact email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-fix-text">
              Pickup / region (optional)
            </label>
            <input
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text"
            />
          </div>
          <Button type="submit" disabled={submitting} variant="cta" className="w-full sm:w-auto">
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
