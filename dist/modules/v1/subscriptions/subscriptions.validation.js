"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSubscriptionSchema = exports.userSubscriptionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSubscriptionSchema = zod_1.default.object({
    serviceId: zod_1.default.string().min(1, "Service ID is required"),
    categoryId: zod_1.default.string().min(1, "Category ID is required"),
    planName: zod_1.default.string().min(1, "Plan name is required"),
    remindBeforeDays: zod_1.default.string().min(1, "Remind before days is required"),
    amount: zod_1.default.number().min(1, "Amount is required"),
    currency: zod_1.default.string().min(1, "Currency is required"),
    paymentMethod: zod_1.default.string().min(1, "Payment method is required"),
    billingCycle: zod_1.default.string().min(1, "Billing cycle is required"),
    renewalDate: zod_1.default.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, zod_1.default.date().refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date",
    })),
    notes: zod_1.default.string().optional(),
});
exports.updateUserSubscriptionSchema = zod_1.default.object({
    id: zod_1.default.string().min(1, "Subscription ID is required"),
    planName: zod_1.default.string().min(1, "Plan name is required"),
    categoryId: zod_1.default.string().min(1, "Category ID is required"),
    serviceId: zod_1.default.string().min(1, "Service ID is required"),
    remindBeforeDays: zod_1.default.string().min(1, "Remind before days is required"),
    amount: zod_1.default.number().min(1, "Amount is required"),
    currency: zod_1.default.string().min(1, "Currency is required"),
    paymentMethod: zod_1.default.string().min(1, "Payment method is required"),
    billingCycle: zod_1.default.string().min(1, "Billing cycle is required"),
    isActive: zod_1.default.boolean().optional(),
    renewalDate: zod_1.default.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, zod_1.default.date().refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date",
    })),
    notes: zod_1.default.string().optional(),
});
