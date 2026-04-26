import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

/**
 * GET /api/download?orderId=...&itemId=...
 * Verifies the order is paid and the item is digital, then redirects to the file.
 * For now we don't have real files; we redirect to a placeholder or return instructions.
 * Add real files under public/downloads/{productId}.pdf (or use a bucket and signed URLs).
 */
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  const itemId = request.nextUrl.searchParams.get("itemId");
  if (!orderId || !itemId) {
    return NextResponse.json({ error: "Missing orderId or itemId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Order not paid" }, { status: 403 });
  }

  const item = order.items.find((i) => i.id === itemId);
  if (!item || item.type !== "digital") {
    return NextResponse.json({ error: "Item not found or not downloadable" }, { status: 404 });
  }

  // Optional: require session and match order email or userId
  if (session?.user?.email && order.email !== session.user.email && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
  // When real files exist: serve from `/downloads/${item.productId}.pdf` in public/.

  // Redirect to file if it exists (static file in public/downloads).
  // For now redirect to order page with hash so user sees their order; add real files to public/downloads/ later.
  const orderPageUrl = new URL(`/account/orders/${orderId}`, baseUrl);
  orderPageUrl.searchParams.set("download", "ready");
  return NextResponse.redirect(orderPageUrl);
}
