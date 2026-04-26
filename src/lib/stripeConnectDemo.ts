import type Stripe from "stripe";

import { getStripeClient } from "@/lib/stripe";

/**
 * Extracts `acct_...` from pasted dashboard URLs or trims accidental quotes/whitespace.
 */
export function normalizeStripeConnectAccountId(raw: string): string {
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  const fromUrl = s.match(/acct_[a-zA-Z0-9]+/);
  if (fromUrl) return fromUrl[0];
  return s;
}

export function stripeConnectErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "type" in err && "message" in err) {
    const m = (err as { message?: string }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error.";
}

/**
 * Demo-only defaults.
 * Replace these values in your own implementation once you wire real config.
 */
const DEFAULT_COUNTRY = "us";
const DEFAULT_CURRENCY = "usd";
const DEFAULT_APPLICATION_FEE_CENTS = 123;

export type ConnectAccountStatus = {
  accountId: string;
  readyToProcessPayments: boolean;
  onboardingComplete: boolean;
  requirementsStatus: string;
  cardPaymentsStatus: string;
  payoutsStatus: string;
};

/**
 * Returns a Stripe client for all Stripe requests in this Connect sample.
 */
export function getConnectStripeClient() {
  return getStripeClient();
}

/**
 * Throws a clear error for required environment variables.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Add ${name}=... to .env.local (placeholder) and restart the dev server.`
    );
  }
  return value;
}

export function appBaseUrl(originFromRequest?: string): string {
  return process.env.NEXTAUTH_URL || originFromRequest || "http://localhost:3000";
}

export async function fetchConnectAccountStatus(accountId: string): Promise<ConnectAccountStatus> {
  const stripeClient = getConnectStripeClient();
  // We use include fields recommended for v2 onboarding/readiness checks.
  const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
    include: ["configuration.merchant", "requirements"],
  });

  const cardPaymentsStatus =
    account?.configuration?.merchant?.capabilities?.card_payments?.status || "unknown";
  const payoutsStatus =
    (
      account?.configuration?.merchant?.capabilities?.stripe_balance as unknown as { status?: string } | undefined
    )?.status || "unknown";
  const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status || "unknown";
  const onboardingComplete = requirementsStatus !== "currently_due" && requirementsStatus !== "past_due";
  const readyToProcessPayments = cardPaymentsStatus === "active";

  return {
    accountId,
    readyToProcessPayments,
    onboardingComplete,
    requirementsStatus,
    cardPaymentsStatus,
    payoutsStatus,
  };
}

export function coercePriceCents(raw: unknown): number {
  const parsed =
    typeof raw === "number" ? raw : typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("priceInCents must be a positive integer.");
  }
  return Math.round(parsed);
}

export function getDefaultCurrency(raw?: string): string {
  return (raw || DEFAULT_CURRENCY).toLowerCase();
}

export function getApplicationFeeCents(raw?: unknown): number {
  const parsed =
    typeof raw === "number" ? raw : typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  return DEFAULT_APPLICATION_FEE_CENTS;
}

export function getDefaultCountry() {
  return DEFAULT_COUNTRY;
}

export function toDateOrNull(unixSeconds?: number | null): Date | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000);
}

export function isSubscriptionEventType(type: string): boolean {
  return (
    type === "customer.subscription.updated" ||
    type === "customer.subscription.deleted" ||
    type === "payment_method.attached" ||
    type === "payment_method.detached" ||
    type === "customer.updated" ||
    type === "customer.tax_id.created" ||
    type === "customer.tax_id.updated" ||
    type === "customer.tax_id.deleted" ||
    type === "billing_portal.configuration.created" ||
    type === "billing_portal.configuration.updated" ||
    type === "billing_portal.session.created"
  );
}

export function hasStripeSig(headers: Headers): string | null {
  return headers.get("stripe-signature");
}

export type ThinEventLike = {
  id: string;
  type: string;
};

/**
 * Stripe thin-event helpers in SDKs are evolving. This helper keeps the sample
 * explicit and resilient while still following Stripe's thin event guidance.
 */
export function parseThinEventOrThrow(args: {
  stripeClient: Stripe;
  body: string;
  signature: string;
  webhookSecret: string;
}): ThinEventLike {
  const anyClient = args.stripeClient as unknown as {
    parseThinEvent?: (body: string, signature: string, secret: string) => ThinEventLike;
  };
  if (!anyClient.parseThinEvent) {
    throw new Error(
      "stripeClient.parseThinEvent is unavailable in this SDK/runtime. Update Stripe SDK and verify thin-event parsing support."
    );
  }
  return anyClient.parseThinEvent(args.body, args.signature, args.webhookSecret);
}
