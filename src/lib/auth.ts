import { betterAuth } from "better-auth";
import { admin, customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      scope: ["email", "public_profile"],
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL as string, process.env.BACKEND_URL as string],
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
          imagePublicId: userData?.imagePublicId,
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
  user: {
    additionalFields: {
      timezone: {
        type: "string",
        defaultValue: "UTC",
        required: false,
      },
      imagePublicId: {
        type: "string",
        defaultValue: "",
        required: false,
      },
    },
  },
});

export type UserType = typeof auth.$Infer.Session;
