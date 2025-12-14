"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const plugins_1 = require("better-auth/plugins");
const prisma_1 = require("better-auth/adapters/prisma");
const database_1 = require("./database");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(database_1.prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            scope: ["email", "public_profile"],
        },
    },
    trustedOrigins: [
        "https://www.subsavver.com",
        "https://subsavver.com",
        "https://api.subsavver.com",
        "http://localhost:3000",
    ],
    plugins: [
        (0, plugins_1.admin)({
            defaultRole: "user",
        }),
        (0, plugins_1.customSession)(async ({ user, session }) => {
            const userData = await database_1.prisma.user.findFirst({
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
                    const plan = await database_1.prisma.plan.findFirst({
                        where: {
                            type: "FREE",
                        },
                    });
                    await database_1.prisma.user.update({
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
        crossSubDomainCookies: {
            enabled: true,
            domain: ".subsavver.com",
        },
        cookies: {
            session_token: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                },
            },
        },
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
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
