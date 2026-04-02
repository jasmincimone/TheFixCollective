-- CreateTable
CREATE TABLE "ShopPage" (
    "id" TEXT NOT NULL,
    "shopSlug" TEXT NOT NULL,
    "name" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "categoriesJson" JSONB,
    "featuredJson" JSONB,
    "featureSectionsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopCatalogListing" (
    "id" TEXT NOT NULL,
    "shopSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageFit" TEXT,
    "badge" TEXT,
    "format" TEXT,
    "optionsJson" TEXT,
    "stripePaymentLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopCatalogListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopPage_shopSlug_key" ON "ShopPage"("shopSlug");

-- CreateIndex
CREATE INDEX "ShopCatalogListing_shopSlug_idx" ON "ShopCatalogListing"("shopSlug");

-- CreateIndex
CREATE INDEX "ShopCatalogListing_shopSlug_status_idx" ON "ShopCatalogListing"("shopSlug", "status");
