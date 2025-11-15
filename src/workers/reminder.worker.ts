import { Worker } from "bullmq";
import { reminderQueue } from "../queues/reminder.queue";
import { prisma } from "../lib/database";
import { sendRemainderEmail } from "../lib/mailer";
import { getNextCycleDate } from "../helpers/dateCycle";
import dayjs from "../lib/dayjs";
import config from "../config/config";

async function createWorker() {
  const worker = new Worker(
    "reminders",
    async (job) => {
      const { reminderId } = job.data;
      const reminder = await prisma.reminder.findUnique({
        where: {
          id: reminderId,
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

      if (!reminder) return;

      const user = reminder.subscription.user;
      const userTimezone = user.timezone || "UTC";

      const send = await sendRemainderEmail(
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

      if (!send) {
        throw new Error("Failed to send reminder email");
      }

      const nextPaymentDate = getNextCycleDate(reminder.subscription.renewalDate, "monthly");

      await prisma.$transaction([
        prisma.reminder.update({
          where: {
            id: reminderId,
          },
          data: {
            sent: true,
            sentAt: new Date(),
          },
        }),
        prisma.userSubscription.update({
          where: {
            id: reminder.subscriptionId,
          },
          data: {
            nextPaymentDate,
          },
        }),
      ]);
    },
    {
      connection: await reminderQueue.client,
      concurrency: 5,
    }
  );

  return worker;
}

export default createWorker();
