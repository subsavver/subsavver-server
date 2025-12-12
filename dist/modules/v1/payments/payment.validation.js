"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const constants_1 = require("../../../constants");
exports.createPaymentSchema = zod_1.default.object({
    userId: zod_1.default.string().optional(),
    subscriptionId: zod_1.default.string().min(1, "Subscription ID is required"),
    amount: zod_1.default.number().min(1, "Amount is required"),
    currency: zod_1.default.enum(constants_1.CURRENCIES).default("USD"),
    paymentProvider: zod_1.default.enum(constants_1.PAYMENT_PROVIDERS).default("STRIPE"),
    paymentStatus: zod_1.default.enum(constants_1.PAYMENT_STATUSES).default("PENDING"),
    paidAt: zod_1.default.coerce.date().optional(),
    isPaid: zod_1.default.boolean().optional().default(true),
});
exports.updatePaymentSchema = zod_1.default.object({
    amount: zod_1.default.number().min(1, "Amount is required"),
    currency: zod_1.default.enum(constants_1.CURRENCIES).default("USD"),
    paymentProvider: zod_1.default.enum(constants_1.PAYMENT_PROVIDERS).default("STRIPE"),
    paymentStatus: zod_1.default.enum(constants_1.PAYMENT_STATUSES).default("PENDING"),
    paidAt: zod_1.default.coerce.date().optional(),
    isPaid: zod_1.default.boolean().optional().default(true),
});
