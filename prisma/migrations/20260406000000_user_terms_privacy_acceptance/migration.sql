-- Record acceptance of Terms & Conditions and Privacy Policy at account creation (audit trail).
ALTER TABLE "User" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3);
