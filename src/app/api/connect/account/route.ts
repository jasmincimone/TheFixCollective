import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { fetchConnectAccountStatus, getConnectStripeClient, getDefaultCountry } from "@/lib/stripeConnectDemo";

export const runtime = "nodejs";

/**
 * GET: returns current user's connected account mapping + live onboarding status from Stripe.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeConnectAccountId: true },
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (!user.stripeConnectAccountId) {
    return NextResponse.json({
      accountId: null,
      onboarding: null,
      message: "No connected account yet. Use POST /api/connect/account to create one.",
    });
  }

  const onboarding = await fetchConnectAccountStatus(user.stripeConnectAccountId);
  return NextResponse.json({ accountId: user.stripeConnectAccountId, onboarding });
}

/**
 * POST: creates a v2 connected account and stores the user->account mapping in DB.
 * Uses only the properties requested in your requirements.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeConnectAccountId: true },
  });
  if (!user?.email) return NextResponse.json({ error: "User email is required." }, { status: 400 });
  if (user.stripeConnectAccountId) {
    const onboarding = await fetchConnectAccountStatus(user.stripeConnectAccountId);
    return NextResponse.json(
      { accountId: user.stripeConnectAccountId, onboarding, message: "Connected account already exists." },
      { status: 200 }
    );
  }

  const displayName =
    typeof body?.displayName === "string" && body.displayName.trim()
      ? body.displayName.trim()
      : user.name?.trim() || user.email;
  const contactEmail =
    typeof body?.contactEmail === "string" && body.contactEmail.trim()
      ? body.contactEmail.trim()
      : user.email;

  const stripeClient = getConnectStripeClient();
  try {
    const account = await stripeClient.v2.core.accounts.create({
      display_name: displayName,
      contact_email: contactEmail,
      identity: {
        country: getDefaultCountry(),
      },
      dashboard: "full",
      defaults: {
        responsibilities: {
          fees_collector: "stripe",
          losses_collector: "stripe",
        },
      },
      configuration: {
        customer: {},
        merchant: {
          capabilities: {
            card_payments: {
              requested: true,
            },
          },
        },
      },
    });

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { stripeConnectAccountId: account.id },
      });
    } catch {
      // Recovery path: account exists in Stripe but local mapping failed.
      return NextResponse.json(
        {
          error:
            `Connected account ${account.id} was created in Stripe, but saving local mapping failed. ` +
            "Use POST /api/connect/account/link with this accountId to recover.",
          recoverableAccountId: account.id,
        },
        { status: 500 }
      );
    }

    const onboarding = await fetchConnectAccountStatus(account.id);
    return NextResponse.json({ accountId: account.id, onboarding }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create connected account." },
      { status: 500 }
    );
  }
}
