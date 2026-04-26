import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { appBaseUrl, getConnectStripeClient } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * Creates a v2 account onboarding link for the signed-in user's connected account.
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
    return NextResponse.json(
      { error: "No connected account mapping found. Create a connected account first." },
      { status: 400 }
    );
  }

  const baseUrl = appBaseUrl(request.nextUrl.origin);
  const stripeClient = getConnectStripeClient();
  const accountLink = await stripeClient.v2.core.accountLinks.create({
    account: accountId,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["merchant", "customer"],
        refresh_url: `${baseUrl}/account/connect-demo`,
        return_url: `${baseUrl}/account/connect-demo?accountId=${accountId}`,
      },
    },
  });

  return NextResponse.json({ url: accountLink.url });
}
