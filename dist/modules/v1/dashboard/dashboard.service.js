"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const database_1 = require("../../../lib/database");
const getStats = async (userId) => {
    const totalSubscriptions = await database_1.prisma.userSubscription.count({
        where: {
            userId,
            isActive: true,
        },
    });
    const subscriptions = await database_1.prisma.userSubscription.findMany({
        where: {
            userId,
            isActive: true,
        },
    });
    const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
        // Assuming amount is monthly for simplicity for now, or we need to normalize based on billing cycle
        return acc + sub.amount;
    }, 0);
    // Calculate upcoming renewals (next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const upcomingRenewals = await database_1.prisma.userSubscription.findMany({
        where: {
            userId,
            isActive: true,
            renewalDate: {
                gte: today,
                lte: thirtyDaysFromNow,
            },
        },
        orderBy: {
            renewalDate: "asc",
        },
        take: 5,
        include: {
            service: true,
        },
    });
    return {
        totalSubscriptions,
        totalMonthlySpend,
        upcomingRenewals,
    };
};
const getChartData = async (userId) => {
    // Placeholder for chart data logic
    // In a real app, we would aggregate spending history
    // For MVP, we can return category breakdown
    const categorySpend = (await database_1.prisma.userSubscription.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            isActive: true,
        },
        _sum: {
            amount: true,
        },
    }));
    const categories = await database_1.prisma.category.findMany({
        where: {
            id: {
                in: categorySpend.map((c) => c.categoryId).filter((id) => id !== null),
            },
        },
    });
    const chartData = categorySpend.map((item) => {
        const category = categories.find((c) => c.id === item.categoryId);
        return {
            category: category?.name || "Uncategorized",
            amount: item._sum.amount || 0,
        };
    });
    return chartData;
};
exports.DashboardService = {
    getStats,
    getChartData,
};
