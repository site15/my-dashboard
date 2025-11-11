/*
  Warnings:

  - You are about to drop the column `light` on the `Widget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "isBlackTheme" BOOLEAN;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBlackTheme" BOOLEAN,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "light",
ADD COLUMN     "isBlackTheme" BOOLEAN;
