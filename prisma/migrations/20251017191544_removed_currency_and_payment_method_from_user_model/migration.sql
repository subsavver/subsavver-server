/*
  Warnings:

  - You are about to drop the column `currency` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `UserSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "currency",
DROP COLUMN "paymentMethod";
