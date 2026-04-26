ALTER TABLE "User"
  ADD COLUMN "stripeConnectAccountId" TEXT,
  ADD COLUMN "stripeSubscriptionStatus" TEXT,
  ADD COLUMN "stripeSubscriptionPriceId" TEXT,
  ADD COLUMN "stripeSubscriptionCurrentPeriodEnd" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_stripeConnectAccountId_key"
ON "User"("stripeConnectAccountId");
