"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const reminder_queue_1 = require("../queues/reminder.queue");
const database_1 = require("../lib/database");
const mailer_1 = require("../lib/mailer");
const dateCycle_1 = require("../helpers/dateCycle");
const dayjs_1 = __importDefault(require("../lib/dayjs"));
const config_1 = __importDefault(require("../config/config"));
const generate_token_1 = require("../helpers/generate-token");
async function createWorker() {
    const worker = new bullmq_1.Worker("reminders", async (job) => {
        const { reminderId } = job.data;
        const reminder = await database_1.prisma.reminder.findUnique({
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
        if (!reminder)
            return;
        const user = reminder.subscription.user;
        const userTimezone = user.timezone || "UTC";
        const token = (0, generate_token_1.createPaymentToken)(reminder.subscriptionId, user.id);
        const send = await (0, mailer_1.sendRemainderEmail)(user.email, `Your ${reminder.subscription.service.name} subscription renews soon`, {
            name: user.name || "there",
            serviceName: reminder.subscription.planName,
            renewalDate: (0, dayjs_1.default)(reminder.subscription.renewalDate)
                .tz(userTimezone)
                .format("DD/MM/YYYY"),
            dashboardLink: `${config_1.default.frontendUrl}/dashboard/manage`,
            paymentLink: `${config_1.default.backendUrl}/api/v1/payments/mark-as-paid?token=${token}`,
        });
        if (!send) {
            throw new Error("Failed to send reminder email");
        }
        const nextPaymentDate = (0, dateCycle_1.getNextCycleDate)(reminder.subscription.renewalDate, "monthly");
        await database_1.prisma.$transaction([
            database_1.prisma.reminder.update({
                where: {
                    id: reminderId,
                },
                data: {
                    sent: true,
                    sentAt: new Date(),
                },
            }),
            database_1.prisma.userSubscription.update({
                where: {
                    id: reminder.subscriptionId,
                },
                data: {
                    nextPaymentDate,
                },
            }),
        ]);
    }, {
        connection: await reminder_queue_1.reminderQueue.client,
        concurrency: 5,
    });
    return worker;
}
exports.default = createWorker();
