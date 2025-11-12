/*
  Warnings:

  - You are about to drop the column `remindBeforeDays` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "remindBeforeDays";

-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "remindBeforeDays" INTEGER NOT NULL DEFAULT 3;
