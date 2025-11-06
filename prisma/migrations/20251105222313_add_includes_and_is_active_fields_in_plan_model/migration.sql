-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "includes" JSONB,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false;
