import cron from "node-cron";
import { prisma } from "../lib/database";
import { REMIND_BEFORE_DAYS } from "../constants";
import dayjs from "../lib/dayjs";

cron.schedule("0 * * * * *", async () => {
  try {
    const now = dayjs().utc();
    const upcomingPayments = await prisma.userSubscription.findMany({
      where: {
        renewalDate: {
          gte: now.toDate(),
          lte: now.add(REMIND_BEFORE_DAYS, "day").toDate(),
        },
      },
      include: {
        user: true,
      },
    });

    for (const subscription of upcomingPayments) {
      const existingPaidPayment = await prisma.payment.findFirst({
        where: {
          subscriptionId: subscription.id,
          paymentStatus: "SUCCESS",
          isPaid: true,
        },
      });

      if (existingPaidPayment) {
        // console.log(
        //   `⏩ Subscription ${subscription.id} already has a successful payment, skipping...`
        // );
        continue;
      }

      const existingPending = await prisma.payment.findFirst({
        where: {
          subscriptionId: subscription.id,
          paymentStatus: "PENDING",
          isPaid: false,
          createdAt: {
            gte: now.subtract(1, "day").toDate(),
            lt: now.toDate(),
          },
        },
      });

      if (existingPending) {
        // console.log(`⏩ Pending payment already exists for ${subscription.id}, skipping...`);
        continue;
      }

      await prisma.payment.create({
        data: {
          userId: subscription.userId,
          subscriptionId: subscription.id,
          amount: subscription.amount,
          currency: "USD",
          paymentStatus: "PENDING",
        },
      });
      console.log(`✅ Creating payment for ${subscription.id}`);
    }
  } catch (error: unknown) {
    console.log("Failed to process reminders:", error);
  }
});
