-- SMS/2FA consent and marketing opt-in for campaigns
ALTER TABLE "User" ADD COLUMN "consentSmsTwoFactorAt" TIMESTAMP(3),
ADD COLUMN "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "marketingOptInAt" TIMESTAMP(3);

-- Existing verified phones: treat as already consented to security SMS (avoid blocking login)
UPDATE "User"
SET "consentSmsTwoFactorAt" = "phoneVerifiedAt"
WHERE "phoneVerifiedAt" IS NOT NULL;
