-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommunityPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "roleAtPost" TEXT NOT NULL,
    "showVendorBadge" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "editedAt" DATETIME,
    CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommunityPost" ("authorId", "content", "createdAt", "editedAt", "id", "roleAtPost", "showVendorBadge", "updatedAt") SELECT "authorId", "content", "createdAt", "editedAt", "id", "roleAtPost", "showVendorBadge", "updatedAt" FROM "CommunityPost";
DROP TABLE "CommunityPost";
ALTER TABLE "new_CommunityPost" RENAME TO "CommunityPost";
CREATE INDEX "CommunityPost_authorId_idx" ON "CommunityPost"("authorId");
CREATE INDEX "CommunityPost_createdAt_idx" ON "CommunityPost"("createdAt");
CREATE INDEX "CommunityPost_updatedAt_idx" ON "CommunityPost"("updatedAt");
CREATE TABLE "new_DirectThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantLowId" TEXT NOT NULL,
    "participantHighId" TEXT NOT NULL,
    "lastMessageAt" DATETIME,
    "participantLowLastReadAt" DATETIME,
    "participantHighLastReadAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DirectThread_participantLowId_fkey" FOREIGN KEY ("participantLowId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DirectThread_participantHighId_fkey" FOREIGN KEY ("participantHighId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DirectThread" ("createdAt", "id", "lastMessageAt", "participantHighId", "participantHighLastReadAt", "participantLowId", "participantLowLastReadAt", "updatedAt") SELECT "createdAt", "id", "lastMessageAt", "participantHighId", "participantHighLastReadAt", "participantLowId", "participantLowLastReadAt", "updatedAt" FROM "DirectThread";
DROP TABLE "DirectThread";
ALTER TABLE "new_DirectThread" RENAME TO "DirectThread";
CREATE INDEX "DirectThread_participantLowId_idx" ON "DirectThread"("participantLowId");
CREATE INDEX "DirectThread_participantHighId_idx" ON "DirectThread"("participantHighId");
CREATE INDEX "DirectThread_lastMessageAt_idx" ON "DirectThread"("lastMessageAt");
CREATE UNIQUE INDEX "DirectThread_participantLowId_participantHighId_key" ON "DirectThread"("participantLowId", "participantHighId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
