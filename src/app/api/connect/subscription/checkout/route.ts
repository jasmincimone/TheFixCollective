import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { appBaseUrl, getConnectStripeClient, requireEnv } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * Starts a hosted Checkout subscription session for the connected account.
 * Uses customer_account = acct_... as requested for v2 connected-account billing.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeConnectAccountId: true },
  });
  const accountId = user?.stripeConnectAccountId;
  if (!accountId) {
    return NextResponse.json({ error: "No connected account mapped for this user." }, { status: 400 });
  }

  // PLACEHOLDER: set PRICE_ID in `.env.local` to a real recurring Stripe Price.
  const priceId = requireEnv("PRICE_ID");
  const baseUrl = appBaseUrl(request.nextUrl.origin);
  const stripeClient = getConnectStripeClient();

  const checkout = await stripeClient.checkout.sessions.create({
    customer_account: accountId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/account/connect-demo?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/account/connect-demo?subscription=cancelled`,
  });

  return NextResponse.json({ url: checkout.url, id: checkout.id });
}
