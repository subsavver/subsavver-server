/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'USER';
