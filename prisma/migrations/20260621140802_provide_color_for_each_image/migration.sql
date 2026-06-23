/*
  Warnings:

  - Added the required column `productImageId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `color` on the `ProductVariant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductColor" AS ENUM ('RED', 'WHITE', 'BLACK', 'YELLOW', 'ORANGE');

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "productImageId" INTEGER NOT NULL,
DROP COLUMN "color",
ADD COLUMN     "color" "ProductColor" NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "ProductImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
