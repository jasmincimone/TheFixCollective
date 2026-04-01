import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId in session metadata");
      return NextResponse.json({ received: true });
    }

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntent:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
        },
      });
    } catch (e) {
      console.error("Failed to update order after payment:", e);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
