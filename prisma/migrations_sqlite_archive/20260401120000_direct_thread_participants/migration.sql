-- Redefine DirectThread: ordered participants (low/high) instead of customer/vendor.
-- Preserves existing rows by mapping customer/vendor into sorted pair and remapping read receipts.

CREATE TABLE "DirectThread_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantLowId" TEXT NOT NULL,
    "participantHighId" TEXT NOT NULL,
    "lastMessageAt" DATETIME,
    "participantLowLastReadAt" DATETIME,
    "participantHighLastReadAt" DATETIME,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DirectThread_new_participantLowId_fkey" FOREIGN KEY ("participantLowId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DirectThread_new_participantHighId_fkey" FOREIGN KEY ("participantHighId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "DirectThread_new" ("id", "participantLowId", "participantHighId", "lastMessageAt", "participantLowLastReadAt", "participantHighLastReadAt", "createdAt", "updatedAt")
SELECT
  "id",
  CASE WHEN "customerId" < "vendorUserId" THEN "customerId" ELSE "vendorUserId" END,
  CASE WHEN "customerId" < "vendorUserId" THEN "vendorUserId" ELSE "customerId" END,
  "lastMessageAt",
  CASE WHEN "customerId" < "vendorUserId" THEN "customerLastReadAt" ELSE "vendorLastReadAt" END,
  CASE WHEN "customerId" < "vendorUserId" THEN "vendorLastReadAt" ELSE "customerLastReadAt" END,
  "createdAt",
  "updatedAt"
FROM "DirectThread";

DROP TABLE "DirectThread";
ALTER TABLE "DirectThread_new" RENAME TO "DirectThread";

CREATE UNIQUE INDEX "DirectThread_participantLowId_participantHighId_key" ON "DirectThread"("participantLowId", "participantHighId");
CREATE INDEX "DirectThread_participantLowId_idx" ON "DirectThread"("participantLowId");
CREATE INDEX "DirectThread_participantHighId_idx" ON "DirectThread"("participantHighId");
CREATE INDEX "DirectThread_lastMessageAt_idx" ON "DirectThread"("lastMessageAt");
