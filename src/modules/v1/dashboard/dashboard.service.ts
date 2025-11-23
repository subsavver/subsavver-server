import { prisma } from "../../../lib/database";

const getStats = async (userId: string) => {
  const totalSubscriptions = await prisma.userSubscription.count({
    where: {
      userId,
      isActive: true,
    },
  });

  const subscriptions = await prisma.userSubscription.findMany({
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

  const upcomingRenewals = await prisma.userSubscription.findMany({
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

const getChartData = async (userId: string) => {
  // Placeholder for chart data logic
  // In a real app, we would aggregate spending history
  // For MVP, we can return category breakdown

  const categorySpend = (await prisma.userSubscription.groupBy({
    by: ["categoryId"] as const,
    where: {
      userId,
      isActive: true,
    },
    _sum: {
      amount: true,
    },
  })) as Array<{ categoryId: string | null; _sum: { amount: number | null } }>;

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categorySpend.map((c) => c.categoryId).filter((id): id is string => id !== null),
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

export const DashboardService = {
  getStats,
  getChartData,
};
