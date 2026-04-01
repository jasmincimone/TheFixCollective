/**
 * True when the latest message in the thread was sent by the peer and the viewer
 * has not read it yet (no lastRead or last message newer than lastRead).
 */
export function isThreadUnreadForViewer(
  viewerId: string,
  thread: {
    participantLowId: string;
    participantLowLastReadAt: Date | null;
    participantHighLastReadAt: Date | null;
    messages: { senderId: string; createdAt: Date }[];
  }
): boolean {
  const last = thread.messages[0];
  if (!last) return false;
  if (last.senderId === viewerId) return false;

  const isLow = thread.participantLowId === viewerId;
  const readAt = isLow ? thread.participantLowLastReadAt : thread.participantHighLastReadAt;
  if (!readAt) return true;
  return last.createdAt > readAt;
}
