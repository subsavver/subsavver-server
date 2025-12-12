"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const payment_service_1 = __importDefault(require("./payment.service"));
const errorHandler_1 = require("../../../utils/errorHandler");
const config_1 = __importDefault(require("../../../config/config"));
const getAllPayments = async (req, res, next) => {
    try {
        const payments = await payment_service_1.default.getAllPayments();
        if (!payments) {
            throw new errorHandler_1.NotFoundError("No payments found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Payments fetched successfully",
            data: payments,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error getting all payments:", error);
        next(error);
    }
};
const createPayment = async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        const createdPayment = await payment_service_1.default.createPayment(user.id, body);
        if (!createdPayment) {
            throw new Error("Failed to create payment");
        }
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Payment created successfully",
            data: createdPayment,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error creating payment:", error);
        next(error);
    }
};
const getUserPayments = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const page = Number(req.query.page ?? 1);
        const payments = await payment_service_1.default.getUserPayments(userId, page);
        if (!payments) {
            throw new errorHandler_1.NotFoundError("No payments found for this user");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Payments fetched successfully",
            data: payments.data,
            meta: payments.meta,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error getting user payments:", error);
        next(error);
    }
};
const getPaymentById = async (req, res, next) => {
    try {
        const paymentId = req.params.paymentId;
        const payment = await payment_service_1.default.getPaymentById(paymentId);
        if (!payment) {
            throw new errorHandler_1.NotFoundError("Payment not found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Payment fetched successfully",
            data: payment,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error getting payment by ID:", error);
        next(error);
    }
};
const confirmPayment = async (req, res, next) => {
    try {
        const paymentId = req.query.id;
        console.log("payment id", paymentId);
        const payment = await payment_service_1.default.getPaymentById(paymentId);
        if (!payment) {
            throw new errorHandler_1.NotFoundError("Payment not found");
        }
        const updatedPayment = await payment_service_1.default.updatePaymentStatus(paymentId, "SUCCESS");
        if (!updatedPayment) {
            throw new Error("Failed to update payment status");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Payment confirm successfully",
            data: updatedPayment,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error marking payment as paid:", error);
        next(error);
    }
};
const markAsPaid = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            throw new Error("Token is required");
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        const payment = await payment_service_1.default.getPaymentBySubscriptionId(decode.subId);
        if (!payment) {
            throw new errorHandler_1.NotFoundError("Payment not found");
        }
        const updatedPayment = await payment_service_1.default.updatePaymentStatus(payment.id, "SUCCESS");
        if (!updatedPayment) {
            throw new Error("Failed to update payment status");
        }
        return res.status(200).redirect(`${config_1.default.frontendUrl}/dashboard/payments`);
    }
    catch (error) {
        // console.log("Error marking payment as paid:", error);
        next(error);
    }
};
const updatePayment = async (req, res, next) => {
    try {
        const paymentId = req.params.paymentId;
        const body = req.body;
        const payment = await payment_service_1.default.getPaymentById(paymentId);
        if (!payment) {
            throw new errorHandler_1.NotFoundError("Payment not found");
        }
        const updatedPayment = await payment_service_1.default.updatePayment(paymentId, body);
        if (!updatedPayment) {
            throw new Error("Failed to update payment");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Payment updated successfully",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        // console.log("Error marking payment as paid:", error);
        next(error);
    }
};
const PaymentController = {
    createPayment,
    getAllPayments,
    getUserPayments,
    getPaymentById,
    markAsPaid,
    confirmPayment,
    updatePayment,
};
exports.default = PaymentController;
