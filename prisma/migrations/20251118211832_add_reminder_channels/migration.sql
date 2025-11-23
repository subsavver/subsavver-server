-- CreateEnum
CREATE TYPE "reminder_channel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "channel" "reminder_channel" NOT NULL DEFAULT 'EMAIL';
