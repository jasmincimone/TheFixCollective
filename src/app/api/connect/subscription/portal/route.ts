import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { appBaseUrl, getConnectStripeClient } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * Creates a billing portal session for connected-account subscription management.
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
  if (!accountId) return NextResponse.json({ error: "No connected account mapped for this user." }, { status: 400 });

  const baseUrl = appBaseUrl(request.nextUrl.origin);
  const stripeClient = getConnectStripeClient();
  const portal = await stripeClient.billingPortal.sessions.create({
    customer_account: accountId,
    return_url: `${baseUrl}/account/connect-demo`,
  });

  return NextResponse.json({ url: portal.url });
}
