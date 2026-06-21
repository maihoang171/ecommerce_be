/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Campaign` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_categoryId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CampaignToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CampaignToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CampaignToProduct_B_index" ON "_CampaignToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToProduct" ADD CONSTRAINT "_CampaignToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
