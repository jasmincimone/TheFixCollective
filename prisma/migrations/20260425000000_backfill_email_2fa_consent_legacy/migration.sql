-- Legacy accounts: they were already receiving email OTP before explicit email consent existed.
UPDATE "User"
SET "consentEmailTwoFactorAt" = "createdAt"
WHERE "consentEmailTwoFactorAt" IS NULL
  AND "twoFactorMethod" = 'EMAIL';

-- Admins with no stored 2FA method are treated as email OTP at sign-in; grandfather consent the same way.
UPDATE "User"
SET "consentEmailTwoFactorAt" = "createdAt"
WHERE "consentEmailTwoFactorAt" IS NULL
  AND "role" = 'ADMIN'
  AND COALESCE("twoFactorMethod", 'NONE') = 'NONE';
