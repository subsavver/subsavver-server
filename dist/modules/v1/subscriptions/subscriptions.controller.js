"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../../utils/errorHandler");
const database_1 = require("../../../lib/database");
const constants_1 = require("../../../constants");
const subscriptions_service_1 = __importDefault(require("./subscriptions.service"));
const dayjs_1 = __importDefault(require("../../../lib/dayjs"));
// Get all subscriptions
const getAllUserSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await subscriptions_service_1.default.getUsersSubscriptions();
        if (!subscriptions) {
            throw new errorHandler_1.NotFoundError("No subscriptions found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscriptions fetched successfully",
            data: subscriptions,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Create subscription
const createUserSubscription = async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not authenticated");
        }
        const existingSubscription = await database_1.prisma.userSubscription.findFirst({
            where: {
                userId: user.id,
                planName: body.planName,
                isActive: true,
            },
        });
        if (existingSubscription) {
            throw new errorHandler_1.ConflictError("Subscription already exists");
        }
        const subscription = await subscriptions_service_1.default.createUserSubscription(body, user.id);
        // Create default remainder
        const notifyAt = (0, dayjs_1.default)(body.renewalDate)
            .subtract(Number(body.remindBeforeDays) || constants_1.REMIND_BEFORE_DAYS, "day")
            .toDate();
        await database_1.prisma.reminder.create({
            data: {
                userId: user.id,
                subscriptionId: subscription?.id,
                notifyAt,
            },
        });
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscription created successfully",
            data: subscription,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Get User Subscriptions
const getUserSubscriptions = async (req, res, next) => {
    try {
        const user = req.user;
        const { page } = req.query;
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not authenticated");
        }
        const subscriptions = await subscriptions_service_1.default.getUserSubscriptions(user.id, Number(page || 1));
        if (!subscriptions) {
            throw new errorHandler_1.NotFoundError("No subscriptions found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscriptions fetched successfully",
            data: subscriptions.data,
            meta: subscriptions.meta,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const getUserSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not authenticated");
        }
        const subscription = await database_1.prisma.userSubscription.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });
        if (!subscription) {
            throw new errorHandler_1.NotFoundError("Subscription not found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscription fetched successfully",
            data: subscription,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const updateUserSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const user = req.user;
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not authenticated");
        }
        const existingSubscription = await database_1.prisma.userSubscription.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });
        if (!existingSubscription) {
            throw new errorHandler_1.NotFoundError("Subscription not found");
        }
        const updatedSubscription = await subscriptions_service_1.default.updateUserSubscription(id, user.id, body);
        if (!updatedSubscription) {
            throw new errorHandler_1.NotFoundError("Subscription not found");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscription updated successfully",
            data: updatedSubscription,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteUserSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not authenticated");
        }
        const existingSubscription = await database_1.prisma.userSubscription.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });
        if (!existingSubscription) {
            throw new errorHandler_1.NotFoundError("Subscription not found");
        }
        const deletedSubscription = await subscriptions_service_1.default.deleteUserSubscription(id, user.id);
        if (!deletedSubscription) {
            throw new errorHandler_1.InternalServerError("Failed to delete subscription");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Subscription deleted successfully",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const SubscriptionsController = {
    getAllUserSubscriptions,
    createUserSubscription,
    getUserSubscriptions,
    getUserSubscriptionById,
    updateUserSubscription,
    deleteUserSubscription,
};
exports.default = SubscriptionsController;
