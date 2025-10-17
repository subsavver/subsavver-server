/*
  Warnings:

  - Added the required column `company` to the `SubscriptionService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionService" ADD COLUMN     "company" TEXT NOT NULL;
