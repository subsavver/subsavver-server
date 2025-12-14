"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
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
const getCategorySpend = async (userId) => {
    const subscriptions = await database_1.prisma.userSubscription.findMany({
        where: {
            userId,
        },
        include: {
            category: true,
        },
    });
    const categorySpend = subscriptions.reduce((acc, sub) => {
        if (sub.category) {
            acc.push({
                name: sub.category.name,
                amount: sub.amount,
            });
        }
        return acc;
    }, []);
    return categorySpend;
};
const getSpendingTrend = async (userId) => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const result = await database_1.prisma.$queryRaw `
    SELECT
      EXTRACT(YEAR FROM "paidAt") AS year,
      EXTRACT(MONTH FROM "paidAt") AS month,
      SUM("amount") AS total
    FROM "payment"
    WHERE "userId" = ${userId}
      AND "isPaid" = true
      AND "paidAt" >= ${sixMonthsAgo}
    GROUP BY year, month
    ORDER BY year, month;
  `;
    return result;
};
const getProjection = async (userId) => {
    const subscriptions = await database_1.prisma.userSubscription.findMany({
        where: {
            userId,
            isActive: true,
        },
    });
    const monthly = subscriptions.reduce((acc, sub) => {
        const month = sub.renewalDate.getMonth();
        acc[month] = (acc[month] || 0) + sub.amount;
        return acc;
    }, {});
    const yearly = subscriptions.reduce((acc, sub) => {
        const year = sub.renewalDate.getFullYear();
        acc[year] = (acc[year] || 0) + sub.amount;
        return acc;
    }, {});
    return {
        monthly,
        yearly,
    };
};
const getTopExpenses = async (userId) => {
    const subscriptions = await database_1.prisma.userSubscription.findMany({
        where: {
            userId,
            isActive: true,
        },
        orderBy: {
            amount: "desc",
        },
        take: 3,
    });
    return subscriptions;
};
exports.AnalyticsService = {
    getStats,
    getChartData,
    getCategorySpend,
    getSpendingTrend,
    getProjection,
    getTopExpenses,
};
