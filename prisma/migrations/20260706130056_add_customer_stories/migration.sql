-- CreateEnum
CREATE TYPE "CustomerStoryStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "CustomerStoryMediaType" AS ENUM ('image', 'video');

-- CreateTable
CREATE TABLE "CustomerStory" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" "CustomerStoryMediaType" NOT NULL DEFAULT 'image',
    "status" "CustomerStoryStatus" NOT NULL DEFAULT 'draft',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "sourceReviewId" TEXT,

    CONSTRAINT "CustomerStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerStory_sourceReviewId_key" ON "CustomerStory"("sourceReviewId");

-- CreateIndex
CREATE INDEX "CustomerStory_status_idx" ON "CustomerStory"("status");

-- CreateIndex
CREATE INDEX "CustomerStory_productId_idx" ON "CustomerStory"("productId");

-- CreateIndex
CREATE INDEX "CustomerStory_sortOrder_idx" ON "CustomerStory"("sortOrder");

-- AddForeignKey
ALTER TABLE "CustomerStory" ADD CONSTRAINT "CustomerStory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStory" ADD CONSTRAINT "CustomerStory_sourceReviewId_fkey" FOREIGN KEY ("sourceReviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
