import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

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

    const admin = await prisma.user.upsert({
      where: {
        email: "subsavver@gmail.com",
      },
      update: {},
      create: {
        id: "admin",
        name: "SubSavver",
        email: "subsavver@gmail.com",
        emailVerified: true,
        role: "ADMIN",
        plan: { connect: { id: freePlan.id } },
        banned: false,
        timezone: "UTC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user seeded:", admin.email);

    console.log("🎉 Seeding completed successfully!");
  } catch (error: unknown) {
    console.log("❌ Seeding failed: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
