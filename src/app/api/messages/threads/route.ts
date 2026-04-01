import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isThreadUnreadForViewer } from "@/lib/directMessageUnread";
import { orderedParticipantIds } from "@/lib/participantPair";
import { prisma } from "@/lib/prisma";
import { ROLES, VENDOR_STATUS } from "@/lib/roles";

const peerSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  vendorProfile: { select: { displayName: true, status: true } },
} as const;

function peerDisplayName(peer: {
  name: string | null;
  email: string | null;
  vendorProfile: { displayName: string } | null;
}): string {
  return (
    peer.vendorProfile?.displayName ??
    peer.name ??
    peer.email?.split("@")[0] ??
    "Member"
  );
}

function peerSubtitle(peer: {
  role: string;
  vendorProfile: { status: string } | null;
}): string {
  if (peer.role === ROLES.ADMIN) return "Admin";
  const st = peer.vendorProfile?.status;
  if (st === VENDOR_STATUS.APPROVED) return "Marketplace vendor";
  return "Community member";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const uid = session.user.id;

  let threads;
  try {
    threads = await prisma.directThread.findMany({
      where: {
        OR: [{ participantLowId: uid }, { participantHighId: uid }],
      },
      include: {
        participantLow: { select: peerSelect },
        participantHigh: { select: peerSelect },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, createdAt: true, senderId: true },
        },
      },
    });
  } catch (e) {
    console.error("[messages/threads GET]", e);
    return NextResponse.json(
      {
        error:
          "Could not load messages. If you just pulled this repo, run `npx prisma migrate dev` and restart the dev server.",
      },
      { status: 500 }
    );
  }

  const sorted = [...threads].sort((a, b) => {
    const ta = a.lastMessageAt?.getTime() ?? a.updatedAt.getTime();
    const tb = b.lastMessageAt?.getTime() ?? b.updatedAt.getTime();
    return tb - ta;
  });

  const items = sorted.map((t) => {
    const isViewerLow = t.participantLowId === uid;
    const peer = isViewerLow ? t.participantHigh : t.participantLow;
    const last = t.messages[0];
    const unread = isThreadUnreadForViewer(uid, {
      participantLowId: t.participantLowId,
      participantLowLastReadAt: t.participantLowLastReadAt,
      participantHighLastReadAt: t.participantHighLastReadAt,
      messages: t.messages,
    });
    return {
      id: t.id,
      peerDisplayName: peerDisplayName(peer),
      peerSubtitle: peerSubtitle(peer),
      lastMessagePreview: last?.body.slice(0, 120) ?? "",
      lastMessageAt:
        last?.createdAt?.toISOString() ??
        t.lastMessageAt?.toISOString() ??
        t.createdAt.toISOString(),
      unread,
    };
  });

  return NextResponse.json(
    { threads: items },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { vendorProfileId?: string; userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const vendorProfileId = body.vendorProfileId?.trim();
  const targetUserIdRaw = body.userId?.trim();

  const hasVendor = !!vendorProfileId;
  const hasUser = !!targetUserIdRaw;
  if (hasVendor === hasUser) {
    return NextResponse.json(
      { error: "Send exactly one of: vendorProfileId, userId" },
      { status: 400 }
    );
  }

  let targetUserId: string;
  if (hasVendor) {
    const profile = await prisma.vendorProfile.findUnique({
      where: { id: vendorProfileId! },
    });
    if (!profile || profile.status !== VENDOR_STATUS.APPROVED) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    targetUserId = profile.userId;
  } else {
    const target = await prisma.user.findUnique({
      where: { id: targetUserIdRaw! },
      select: { id: true },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    targetUserId = target.id;
  }

  const selfId = session.user.id;
  if (selfId === targetUserId) {
    return NextResponse.json({ error: "You cannot message yourself" }, { status: 400 });
  }

  const { low, high } = orderedParticipantIds(selfId, targetUserId);

  let thread;
  try {
    thread = await prisma.directThread.upsert({
      where: {
        participantLowId_participantHighId: {
          participantLowId: low,
          participantHighId: high,
        },
      },
      create: { participantLowId: low, participantHighId: high },
      update: {},
    });
  } catch (e) {
    console.error("[messages/threads POST]", e);
    return NextResponse.json(
      {
        error:
          "Could not create conversation. Run `npx prisma migrate dev` if the database is out of date.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    thread: {
      id: thread.id,
      participantLowId: thread.participantLowId,
      participantHighId: thread.participantHighId,
    },
  });
}
