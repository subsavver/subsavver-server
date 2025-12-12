"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants");
const database_1 = require("../../../lib/database");
const getUsersSubscriptions = async () => {
    try {
        const subscriptions = await database_1.prisma.userSubscription.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                        emailVerified: true,
                    },
                },
            },
        });
        return subscriptions;
    }
    catch (error) {
        console.log(error);
    }
};
const getUserSubscriptions = async (userId, page = 1) => {
    try {
        const skip = (page - 1) * constants_1.PAGE_LIMIT;
        const totalSubscriptions = await database_1.prisma.userSubscription.count({
            where: {
                userId,
            },
        });
        const subscriptions = await database_1.prisma.userSubscription.findMany({
            where: {
                userId,
            },
            include: {
                service: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            take: constants_1.PAGE_LIMIT,
            skip: skip,
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            data: subscriptions,
            meta: {
                total: totalSubscriptions,
                page,
                limit: constants_1.PAGE_LIMIT,
                totalPages: Math.ceil(totalSubscriptions / constants_1.PAGE_LIMIT),
            },
        };
    }
    catch (error) {
        console.log(error);
    }
};
const createUserSubscription = async (body, userId) => {
    try {
        const createdSubscription = await database_1.prisma.userSubscription.create({
            data: {
                ...body,
                currency: body.currency,
                paymentMethod: body.paymentMethod,
                billingCycle: body.billingCycle,
                remindBeforeDays: Number(body.remindBeforeDays),
                userId,
            },
        });
        return createdSubscription;
    }
    catch (error) {
        console.log(error);
    }
};
const updateUserSubscription = async (subscriptionId, userId, data) => {
    try {
        const updatedSubscription = await database_1.prisma.userSubscription.update({
            where: {
                id: subscriptionId,
                userId,
            },
            data: {
                ...data,
                currency: data.currency,
                paymentMethod: data.paymentMethod,
                billingCycle: data.billingCycle,
                remindBeforeDays: Number(data.remindBeforeDays),
            },
            include: {
                service: true,
            },
        });
        return updatedSubscription;
    }
    catch (error) {
        console.log(error);
    }
};
const deleteUserSubscription = async (subscriptionId, userId) => {
    try {
        const deletedSubscription = await database_1.prisma.userSubscription.delete({
            where: {
                id: subscriptionId,
                userId,
            },
        });
        return deletedSubscription;
    }
    catch (error) {
        console.log(error);
    }
};
const SubscriptionsService = {
    getUsersSubscriptions,
    getUserSubscriptions,
    createUserSubscription,
    updateUserSubscription,
    deleteUserSubscription,
};
exports.default = SubscriptionsService;
