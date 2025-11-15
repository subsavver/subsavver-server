import cron from "node-cron";
import dayjs from "../lib/dayjs";
import { prisma } from "../lib/database";
import { reminderQueue } from "../queues/reminder.queue";

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const now = dayjs().utc();
  // console.log("🕒 Checking reminders...");

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

  let readyToSend = 0;

  for (const reminder of upcomingReminders) {
    const user = reminder.subscription.user;
    const userTimezone = user.timezone || "UTC";
    const nowUser = dayjs().tz(userTimezone);
    const notifyAtUser = dayjs(reminder.notifyAt).tz(userTimezone);

    if (nowUser.isAfter(notifyAtUser) || nowUser.isSame(notifyAtUser)) {
      readyToSend++;
      await reminderQueue.add(
        "sendReminder",
        {
          reminderId: reminder.id,
        },
        {
          attempts: 2,
          backoff: {
            type: "exponential",
            delay: 60000,
          },
        }
      );
    }
  }

  console.log(`Pushed ${readyToSend} reminders to Upstash queue`);
});
