"use client";

import { useCallback, useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";

type OnboardingState = {
  accountId: string;
  readyToProcessPayments: boolean;
  onboardingComplete: boolean;
  requirementsStatus: string;
  cardPaymentsStatus: string;
  payoutsStatus: string;
};

type AccountResponse = {
  accountId: string | null;
  onboarding: OnboardingState | null;
  message?: string;
  error?: string;
};

export function ConnectDemoDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [status, setStatus] = useState<OnboardingState | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("2500");
  const [productCurrency, setProductCurrency] = useState("usd");

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/connect/account");
      const data = (await res.json()) as AccountResponse;
      if (!res.ok) {
        setError(data.error || "Could not load connected account.");
        return;
      }
      setAccountId(data.accountId);
      setStatus(data.onboarding);
      if (data.message) setMessage(data.message);
    } catch {
      setError("Could not load connected account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  async function createConnectedAccount() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/connect/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, contactEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create connected account.");
        return;
      }
      setMessage("Connected account ready.");
      setDisplayName("");
      setContactEmail("");
      await loadAccount();
    } catch {
      setError("Failed to create connected account.");
    } finally {
      setSaving(false);
    }
  }

  async function beginOnboarding() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/connect/onboarding-link", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to create onboarding link.");
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Failed to create onboarding link.");
      setSaving(false);
    }
  }

  async function createProduct() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/connect/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          priceInCents: Number.parseInt(productPrice, 10),
          currency: productCurrency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product.");
        return;
      }
      setMessage(`Created product: ${data?.product?.name || "Untitled"}`);
      setProductName("");
      setProductDescription("");
    } catch {
      setError("Failed to create product.");
    } finally {
      setSaving(false);
    }
  }

  async function startSubscriptionCheckout() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/connect/subscription/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to start subscription checkout.");
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Failed to start subscription checkout.");
    } finally {
      setSaving(false);
    }
  }

  async function openBillingPortal() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/connect/subscription/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to create portal session.");
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Failed to create portal session.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      {message ? <p className="rounded-md border border-forest/40 bg-forest/10 px-3 py-2 text-sm text-fix-heading">{message}</p> : null}

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fix-heading">1) Connected account + onboarding</h3>
        {loading ? (
          <p className="mt-2 text-sm text-fix-text-muted">Loading...</p>
        ) : (
          <div className="mt-2 space-y-2 text-sm text-fix-text-muted">
            <p>Connected account ID: {accountId || "Not created yet"}</p>
            <p>Onboarding complete: {status ? (status.onboardingComplete ? "Yes" : "No") : "No account"}</p>
            <p>Requirements status: {status?.requirementsStatus || "n/a"}</p>
            <p>Card payments capability: {status?.cardPaymentsStatus || "n/a"}</p>
          </div>
        )}

        {!accountId ? (
          <div className="mt-4 grid gap-2 sm:max-w-lg">
            <input
              className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
              placeholder="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
              placeholder="Contact email (optional)"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={() => void createConnectedAccount()}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-full bg-fix-cta px-4 text-sm font-medium text-fix-cta-foreground hover:opacity-90 disabled:opacity-50"
            >
              Create connected account
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void beginOnboarding()}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-full bg-fix-cta px-4 text-sm font-medium text-fix-cta-foreground hover:opacity-90 disabled:opacity-50"
            >
              Onboard to collect payments
            </button>
            <button
              type="button"
              onClick={() => void loadAccount()}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-full border border-fix-border/30 bg-fix-surface px-4 text-sm font-medium text-fix-heading hover:bg-fix-bg-muted disabled:opacity-50"
            >
              Refresh status
            </button>
            <a
              href={`/connect-store/${accountId}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-fix-border/30 bg-fix-surface px-4 text-sm font-medium text-fix-heading hover:bg-fix-bg-muted"
            >
              Open storefront page
            </a>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fix-heading">2) Create product (on connected account)</h3>
        <p className="mt-2 text-sm text-fix-text-muted">
          This sends `stripeAccount` request options so product/price are created on the connected account.
        </p>
        <div className="mt-4 grid gap-2 sm:max-w-xl">
          <input
            className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <textarea
            className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
            placeholder="Product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={3}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
              placeholder="Price in cents (e.g. 2500)"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <input
              className="rounded-lg border border-fix-border/25 bg-fix-surface px-3 py-2 text-sm"
              placeholder="Currency (usd)"
              value={productCurrency}
              onChange={(e) => setProductCurrency(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={saving || !accountId || !productName.trim()}
            onClick={() => void createProduct()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-fix-cta px-4 text-sm font-medium text-fix-cta-foreground hover:opacity-90 disabled:opacity-50"
          >
            Create product on connected account
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fix-heading">3) Subscription + billing portal (platform-level)</h3>
        <p className="mt-2 text-sm text-fix-text-muted">
          Uses connected account ID as `customer_account`. Set `PRICE_ID` in your env first.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving || !accountId}
            onClick={() => void startSubscriptionCheckout()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-fix-cta px-4 text-sm font-medium text-fix-cta-foreground hover:opacity-90 disabled:opacity-50"
          >
            Start subscription checkout
          </button>
          <button
            type="button"
            disabled={saving || !accountId}
            onClick={() => void openBillingPortal()}
            className="inline-flex h-10 items-center justify-center rounded-full border border-fix-border/30 bg-fix-surface px-4 text-sm font-medium text-fix-heading hover:bg-fix-bg-muted disabled:opacity-50"
          >
            Open billing portal
          </button>
        </div>
      </Card>
    </div>
  );
}
