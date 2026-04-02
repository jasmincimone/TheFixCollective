-- Record that the user acknowledged SMS/2FA terms at account creation (separate from consentSmsTwoFactorAt when sending verification SMS).
ALTER TABLE "User" ADD COLUMN "smsTwoFactorSignupConsentAt" TIMESTAMP(3);
