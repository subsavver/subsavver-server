import { betterAuth } from "better-auth";
import { admin, customSession } from "better-auth/plugins";
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
  trustedOrigins: [process.env.FRONTEND_URL as string, "http://192.168.0.103:3000"],
  plugins: [
    admin({
      defaultRole: "user",
    }),
    customSession(async ({ user, session }) => {
      const userData = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          plan: true,
        },
      });

      return {
        ...session,
        user: {
          ...user,
          plan: userData?.plan,
        },
      };
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
        after: async (user) => {
          const plan = await prisma.plan.findFirst({
            where: {
              type: "FREE",
            },
          });

          await prisma.user.update({
            where: {
              id: user.id,
              email: user.email,
            },
            data: {
              planId: plan?.id,
            },
          });
        },
      },
    },
  },
  advanced: {
    cookiePrefix: "subsavver",
  },
});

export type Session = typeof auth.$Infer.Session;
