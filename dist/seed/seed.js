"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/client");
require("dotenv/config");
const auth_1 = require("../lib/auth");
const seed_data_1 = require("./seed-data");
const prisma = new client_1.PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
});
async function main() {
    console.log("🌱 Seeding database...");
    try {
        const freePlan = await prisma.plan.upsert({
            where: {
                name: "FREE",
            },
            update: {},
            create: {
                name: "FREE",
                price: 0,
                currency: "USD",
                interval: "month",
                isPopular: false,
                features: {
                    trackLimit: 5,
                    emailReminders: true,
                    monthlySummary: "basic",
                    analytics: "basic",
                    categoryAnalytics: false,
                    customReminders: false,
                    smartInsights: false,
                    multipleProfiles: false,
                    earlyAccess: false,
                },
                includes: [
                    "Track up to 5 active subscriptions",
                    "Email reminders before renewals",
                    "Monthly spending summary",
                    "Basic dashboard & analytics",
                    "Access on all devices",
                ],
                type: "FREE",
                isActive: true,
            },
        });
        console.log("✅ Free Plan seeded:", freePlan.name);
        const admin = await auth_1.auth.api.signUpEmail({
            body: {
                name: "SubSavver",
                email: "subsavver@gmail.com",
                password: "123456789",
                callbackURL: "",
                rememberMe: false,
            },
        });
        console.log("✅ Admin user seeded:", admin.user.name);
        for (const category of seed_data_1.categories) {
            const createdCategory = await prisma.category.create({
                data: {
                    name: category.name,
                    description: category.description,
                },
            });
            for (const service of category.services) {
                await prisma.subscriptionService.create({
                    data: {
                        name: service.name,
                        logo: service.logo,
                        company: service.company,
                        categoryId: createdCategory.id,
                        createdBy: admin.user.id,
                    },
                });
                console.log("✅ Service seeded");
            }
            console.log("✅ Category seeded");
        }
        console.log("🎉 Seeding completed successfully!");
    }
    catch (error) {
        console.log("❌ Seeding failed: ", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
