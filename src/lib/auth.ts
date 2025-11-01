import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database";

// export const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: [process.env.FRONTEND_URL as string],
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "USER",
            },
          };
        },
      },
    },
  },
  advanced: {
    cookiePrefix: "subsavver",
  },
});

export type Session = typeof auth.$Infer.Session;
