-- `updatedAt`, `editedAt`, and this index are already applied by
-- `20260401040811_add_community_post_edits`. This migration remains for history; keep it idempotent
-- so `migrate deploy` does not fail with "duplicate column name" after 040811.
CREATE INDEX IF NOT EXISTS "CommunityPost_updatedAt_idx" ON "CommunityPost"("updatedAt");
