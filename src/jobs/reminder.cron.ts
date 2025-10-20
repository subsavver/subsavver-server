import cron from "node-cron";
import { prisma } from "../lib/database";
import { sendRemainderEmail } from "../lib/mailer";
import config from "../config/config";
import dayjs from "../lib/dayjs";

// Run every second
cron.schedule("0 * * * * *", async () => {
  // console.log("🕒 Checking reminders...");

  try {
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        sent: false,
      },
      include: {
        user: true,
        subscription: { include: { service: true } },
      },
    });

    console.log(`Found ${upcomingReminders.length} reminders to send`);

    for (const reminder of upcomingReminders) {
      try {
        const userTimezone = reminder.user.timezone || "UTC";
        const nowUser = dayjs().tz(userTimezone);
        const renewalDate = dayjs(reminder.subscription.renewalDate).tz(userTimezone);

        const diffDays = renewalDate.diff(nowUser, "day", true);

        // console.log(`Days until renewal for ${reminder.user.email}: ${diffDays}`);

        if (diffDays <= reminder.remindBeforeDays && diffDays > 0) {
          await sendRemainderEmail(
            reminder.user.email,
            `Your ${reminder.subscription.service.name} subscription renews soon`,
            {
              name: reminder.user.name || "there",
              serviceName: reminder.subscription.planName as string,
              renewalDate: reminder.subscription.renewalDate,
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
              sentAt: new Date(),
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
