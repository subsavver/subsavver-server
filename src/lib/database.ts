import { PrismaClient } from "../generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());
