import cron from "node-cron";
import { prisma } from "../lib/database";
import { sendRemainderEmail } from "../lib/mailer";
import config from "../config/config";

// Run every second
cron.schedule("0 */5 * * * *", async () => {
  // console.log("🕒 Checking reminders...");
  const now = new Date();
  const nowInLocalTime = new Date(now.getTime() + 6 * 60 * 60 * 1000); // Add 6 hours for +06
  // console.log("Current time (+06):", nowInLocalTime.toISOString());

  try {
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        sent: false,
        notifyAt: {
          lte: nowInLocalTime,
        },
      },
      include: {
        user: true,
        subscription: { include: { service: true } },
      },
    });

    // console.log(`Found ${upcomingReminders.length} reminders to send`);

    for (const reminder of upcomingReminders) {
      try {
        const diffDays =
          (reminder.subscription.renewalDate.getTime() - nowInLocalTime.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diffDays <= reminder.remindBeforeDays && diffDays > 0) {
          const { user, subscription } = reminder;
          console.log(`Sending reminder to ${user.email} for ${subscription.service.name}`);
          await sendRemainderEmail(
            reminder.user.email,
            `Your ${reminder.subscription.service.name} subscription renews soon`,
            {
              name: reminder.user.name || "there",
              serviceName: reminder.subscription.planName as string,
              renewalDate: reminder.subscription.renewalDate,
              dashboardLink: `${config.frontendUrl}/dashboard/manage`,
            }
          );
          await prisma.reminder.update({
            where: {
              id: reminder.id,
            },
            data: {
              sent: true,
              sentAt: nowInLocalTime,
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
