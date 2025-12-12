"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("../lib/database");
const constants_1 = require("../constants");
const dayjs_1 = __importDefault(require("../lib/dayjs"));
node_cron_1.default.schedule("*/10 * * * *", async () => {
    try {
        const activeSubscriptions = await database_1.prisma.userSubscription.findMany({
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
            const nowUser = (0, dayjs_1.default)().tz(userTimezone);
            const renewalUser = (0, dayjs_1.default)(subscription.renewalDate).tz(userTimezone);
            const diffDays = renewalUser.diff(nowUser, "day", true);
            if (diffDays <= constants_1.REMIND_BEFORE_DAYS && diffDays >= 0) {
                const paidPayments = await database_1.prisma.payment.findFirst({
                    where: {
                        subscriptionId: subscription.id,
                        isPaid: true,
                        paymentStatus: "SUCCESS",
                    },
                });
                if (paidPayments)
                    continue;
                const existingPayment = await database_1.prisma.payment.findFirst({
                    where: {
                        subscriptionId: subscription.id,
                        paymentStatus: "PENDING",
                    },
                });
                if (existingPayment)
                    continue;
                await database_1.prisma.payment.create({
                    data: {
                        userId: subscription.userId,
                        subscriptionId: subscription.id,
                        amount: subscription.amount,
                        paymentStatus: "PENDING",
                    },
                });
            }
        }
    }
    catch (error) {
        console.log("Failed to process timezone-based payments:", error);
    }
});
