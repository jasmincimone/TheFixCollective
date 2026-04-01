-- CreateTable
CREATE TABLE "RootSyncConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RootSyncConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RootSyncMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RootSyncMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "RootSyncConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RootSyncConversation_userId_idx" ON "RootSyncConversation"("userId");

-- CreateIndex
CREATE INDEX "RootSyncConversation_userId_updatedAt_idx" ON "RootSyncConversation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "RootSyncMessage_conversationId_idx" ON "RootSyncMessage"("conversationId");
