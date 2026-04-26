import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { fetchConnectAccountStatus, getConnectStripeClient } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * Recovery endpoint: attach an already-created Stripe connected account (`acct_...`)
 * to the signed-in user if local DB mapping was lost.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
  if (!accountId.startsWith("acct_")) {
    return NextResponse.json({ error: "Valid accountId (acct_...) is required." }, { status: 400 });
  }

  // Verify account exists in Stripe before writing local mapping.
  const stripeClient = getConnectStripeClient();
  await stripeClient.v2.core.accounts.retrieve(accountId);

  await prisma.user.update({
    where: { id: userId },
    data: { stripeConnectAccountId: accountId },
  });

  const onboarding = await fetchConnectAccountStatus(accountId);
  return NextResponse.json({ accountId, onboarding, message: "Connected account linked." });
}
