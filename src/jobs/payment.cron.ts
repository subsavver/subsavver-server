import cron from "node-cron";
import { prisma } from "../lib/database";
import { REMIND_BEFORE_DAYS } from "../constants";
import dayjs from "../lib/dayjs";

cron.schedule("*/10 * * * *", async () => {
  try {
    const activeSubscriptions = await prisma.userSubscription.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    for (const subscription of activeSubscriptions) {
      const user = subscription.user;
      const userTimezone = user.timezone || "UTC";

      const nowUser = dayjs().tz(userTimezone);
      const renewalUser = dayjs(subscription.renewalDate).tz(userTimezone);

      const diffDays = renewalUser.diff(nowUser, "day", true);

      if (diffDays <= REMIND_BEFORE_DAYS && diffDays >= 0) {
        const paidPayments = await prisma.payment.findFirst({
          where: {
            subscriptionId: subscription.id,
            isPaid: true,
            paymentStatus: "SUCCESS",
          },
        });

        if (paidPayments) continue;

        const existingPayment = await prisma.payment.findFirst({
          where: {
            subscriptionId: subscription.id,
            paymentStatus: "PENDING",
          },
        });

        if (existingPayment) continue;

        await prisma.payment.create({
          data: {
            userId: subscription.userId,
            subscriptionId: subscription.id,
            amount: subscription.amount,
            paymentStatus: "PENDING",
          },
        });
      }
    }
  } catch (error: unknown) {
    console.log("Failed to process timezone-based payments:", error);
  }
});
