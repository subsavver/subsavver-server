import cron from "node-cron";
import { prisma } from "../lib/database";
import { sendRemainderEmail } from "../lib/mailer";
import config from "../config/config";
import dayjs from "../lib/dayjs";
import { getNextCycleDate } from "../helpers/dateCycle";

// Run every 10 minutes
cron.schedule("*/20 * * * * *", async () => {
  const now = dayjs().utc();
  // console.log("🕒 Checking reminders...");

  try {
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        sent: false,
        subscription: {
          isActive: true,
        },
        notifyAt: {
          lte: now.toDate(),
        },
      },
      include: {
        subscription: {
          include: {
            service: true,
            user: true,
          },
        },
      },
    });

    console.log(`Found ${upcomingReminders.length} reminders to send`);

    for (const reminder of upcomingReminders) {
      try {
        const user = reminder.subscription.user;
        const userTimezone = user.timezone || "UTC";
        const nowUser = dayjs().tz(userTimezone);
        const notifyAtUser = dayjs(reminder.notifyAt).tz(userTimezone);

        // console.log(`Days until renewal for ${reminder.user.email}: ${diffDays}`);
        if (nowUser.isAfter(notifyAtUser)) {
          await sendRemainderEmail(
            user.email,
            `Your ${reminder.subscription.service.name} subscription renews soon`,
            {
              name: user.name || "there",
              serviceName: reminder.subscription.planName as string,
              renewalDate: dayjs(reminder.subscription.renewalDate)
                .tz(userTimezone)
                .format("DD/MM/YYYY"),
              dashboardLink: `${config.frontendUrl}/dashboard/manage`,
              paymentLink: `${config.frontendUrl}/dashboard/payments/${reminder.subscription.id}`,
            }
          );
          await prisma.reminder.update({
            where: {
              id: reminder.id,
            },
            data: {
              sent: true,
              sentAt: nowUser.toDate(),
            },
          });

          // 🌀 Calculate next cycle date
          const nextPaymentDate = getNextCycleDate(reminder.subscription.renewalDate, "monthly");

          await prisma.userSubscription.update({
            where: {
              id: reminder.subscriptionId,
            },
            data: {
              nextPaymentDate,
            },
          });
        }
      } catch (error: unknown) {
        console.log("Failed to send reminder:", error);
      }
    }
  } catch (error: unknown) {
    console.log("Reminder check failed:", error);
  }
});
