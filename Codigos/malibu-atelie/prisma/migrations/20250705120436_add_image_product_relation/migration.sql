/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Image` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Image_productId_idx";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "updatedAt",
ADD COLUMN     "filename" TEXT NOT NULL;
