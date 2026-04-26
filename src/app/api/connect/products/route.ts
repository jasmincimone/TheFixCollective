import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { coercePriceCents, getConnectStripeClient, getDefaultCurrency } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * Creates a product + default price on the connected account.
 * Uses `stripeAccount` request options to send the Stripe-Account header.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const currency = getDefaultCurrency(typeof body?.currency === "string" ? body.currency : undefined);

  if (!name) return NextResponse.json({ error: "Product name is required." }, { status: 400 });

  let priceInCents: number;
  try {
    priceInCents = coercePriceCents(body?.priceInCents);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid price." }, { status: 400 });
  }

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

  const stripeClient = getConnectStripeClient();
  const product = await stripeClient.products.create(
    {
      name,
      description: description || undefined,
      default_price_data: {
        unit_amount: priceInCents,
        currency,
      },
    },
    {
      stripeAccount: accountId,
    }
  );

  return NextResponse.json({ product }, { status: 201 });
}
