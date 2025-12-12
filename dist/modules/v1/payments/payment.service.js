"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../lib/database");
const dayjs_1 = __importDefault(require("../../../lib/dayjs"));
const errorHandler_1 = require("../../../utils/errorHandler");
const constants_1 = require("../../../constants");
const getAllPayments = async () => {
    try {
        const payments = await database_1.prisma.payment.findMany({
            include: {
                user: { select: { id: true, name: true, email: true, image: true } },
            },
        });
        return payments;
    }
    catch (error) {
        console.log("Error getting all payments:", error);
        throw error;
    }
};
const createPayment = async (userId, body) => {
    try {
        const nowPaymentDate = dayjs_1.default.utc();
        const existingPayment = await database_1.prisma.payment.findFirst({
            where: {
                userId,
                subscriptionId: body.subscriptionId,
            },
        });
        if (existingPayment) {
            throw new errorHandler_1.ConflictError("Payment for this subscription already exists");
        }
        const newPayment = await database_1.prisma.payment.create({
            data: {
                userId,
                paidAt: nowPaymentDate.toDate(),
                ...body,
            },
        });
        return newPayment;
    }
    catch (error) {
        // console.log("Error creating payment:", error);
        throw error;
    }
};
const getUserPayments = async (userId, page = 1) => {
    try {
        const skip = (page - 1) * constants_1.PAGE_LIMIT;
        const totalPayments = await database_1.prisma.payment.count({
            where: { userId },
        });
        const payments = await database_1.prisma.payment.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                subscription: {
                    select: {
                        id: true,
                        planName: true,
                        currency: true,
                        paymentMethod: true,
                    },
                },
            },
            take: constants_1.PAGE_LIMIT,
            skip: skip,
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!payments) {
            return null;
        }
        return {
            data: payments,
            meta: {
                total: totalPayments,
                page,
                limit: constants_1.PAGE_LIMIT,
                totalPages: Math.ceil(totalPayments / constants_1.PAGE_LIMIT),
            },
        };
    }
    catch (error) {
        console.log("Error getting user payments:", error);
        throw error;
    }
};
const getPaymentById = async (paymentId) => {
    try {
        const payment = await database_1.prisma.payment.findFirst({
            where: { id: paymentId },
            include: {
                subscription: {
                    select: {
                        planName: true,
                    },
                },
            },
        });
        return payment;
    }
    catch (error) {
        console.log("Error getting payment by ID:", error);
        throw error;
    }
};
const getPaymentBySubscriptionId = async (subscriptionId) => {
    try {
        const payment = await database_1.prisma.payment.findFirst({
            where: { subscriptionId },
        });
        return payment;
    }
    catch (error) {
        console.log("Error getting payment by subscription ID:", error);
        throw error;
    }
};
const updatePaymentStatus = async (paymentId, status) => {
    try {
        const updatedPayment = await database_1.prisma.payment.update({
            where: { id: paymentId },
            data: {
                paymentStatus: status,
                isPaid: status === "SUCCESS",
                paidAt: status === "SUCCESS" ? new Date() : null,
            },
        });
        return updatedPayment;
    }
    catch (error) {
        console.log("Error updating payment status:", error);
        throw error;
    }
};
const updatePayment = async (paymentId, body) => {
    try {
        const updatedPayment = await database_1.prisma.payment.update({
            where: { id: paymentId },
            data: body,
        });
        return updatedPayment;
    }
    catch (error) {
        console.log("Error updating payment:", error);
        throw error;
    }
};
const PaymentService = {
    getAllPayments,
    createPayment,
    getUserPayments,
    getPaymentById,
    getPaymentBySubscriptionId,
    updatePaymentStatus,
    updatePayment,
};
exports.default = PaymentService;
