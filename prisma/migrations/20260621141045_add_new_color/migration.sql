/*
  Warnings:

  - The values [RED,WHITE,BLACK,YELLOW,ORANGE] on the enum `ProductColor` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductColor_new" AS ENUM ('MIDNIGHT_BLUE', 'CRIMSON_RED', 'VINTAGE_WASH', 'CHARCOAL', 'CLASSIC_WHITE', 'CLASSIC_RED', 'CLASSIC_BLACK', 'CLASSIC_YELLOW', 'CLASSIC_ORANGE');
ALTER TABLE "ProductVariant" ALTER COLUMN "color" TYPE "ProductColor_new" USING ("color"::text::"ProductColor_new");
ALTER TYPE "ProductColor" RENAME TO "ProductColor_old";
ALTER TYPE "ProductColor_new" RENAME TO "ProductColor";
DROP TYPE "public"."ProductColor_old";
COMMIT;
