import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ email: session.user.email }, { userId: session.user.id }],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      email: o.email,
      status: o.status,
      totalCents: o.totalCents,
      trackingCarrier: o.trackingCarrier,
      trackingNumber: o.trackingNumber,
      shippedAt: o.shippedAt?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
      itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    }))
  );
}
