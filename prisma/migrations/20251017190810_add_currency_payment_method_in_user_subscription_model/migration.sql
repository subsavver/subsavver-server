-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "paymentMethod" TEXT;
