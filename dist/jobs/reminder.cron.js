"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const dayjs_1 = __importDefault(require("../lib/dayjs"));
const database_1 = require("../lib/database");
const reminder_queue_1 = require("../queues/reminder.queue");
// Run every 10 minutes
node_cron_1.default.schedule("*/10 * * * *", async () => {
    const now = (0, dayjs_1.default)().utc();
    // console.log("🕒 Checking reminders...");
    const upcomingReminders = await database_1.prisma.reminder.findMany({
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
        const nowUser = (0, dayjs_1.default)().tz(userTimezone);
        const notifyAtUser = (0, dayjs_1.default)(reminder.notifyAt).tz(userTimezone);
        if (nowUser.isAfter(notifyAtUser) || nowUser.isSame(notifyAtUser)) {
            readyToSend++;
            await reminder_queue_1.reminderQueue.add("sendReminder", {
                reminderId: reminder.id,
            }, {
                attempts: 2,
                backoff: {
                    type: "exponential",
                    delay: 60000,
                },
            });
        }
    }
    console.log(`Pushed ${readyToSend} reminders to Upstash queue`);
});
