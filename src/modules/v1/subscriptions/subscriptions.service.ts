import { PAGE_LIMIT } from "../../../constants";
import { prisma } from "../../../lib/database";
import { UpdateUserSubscription, UserSubscription } from "./subscriptions.validation";

const getUsersSubscriptions = async () => {
  try {
    const subscriptions = await prisma.userSubscription.findMany({
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
  } catch (error: unknown) {
    console.log(error);
  }
};

const getUserSubscriptions = async (userId: string, page: number = 1) => {
  try {
    const skip = (page - 1) * PAGE_LIMIT;

    const totalSubscriptions = await prisma.userSubscription.count({
      where: {
        userId,
      },
    });

    const subscriptions = await prisma.userSubscription.findMany({
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
      take: PAGE_LIMIT,
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
        limit: PAGE_LIMIT,
        totalPages: Math.ceil(totalSubscriptions / PAGE_LIMIT),
      },
    };
  } catch (error: unknown) {
    console.log(error);
  }
};

const createUserSubscription = async (body: UserSubscription, userId: string) => {
  try {
    const createdSubscription = await prisma.userSubscription.create({
      data: {
        ...body,
        remindBeforeDays: Number(body.remindBeforeDays),
        userId,
      },
    });

    return createdSubscription;
  } catch (error: unknown) {
    console.log(error);
  }
};

const updateUserSubscription = async (
  subscriptionId: string,
  userId: string,
  data: UpdateUserSubscription
) => {
  try {
    const updatedSubscription = await prisma.userSubscription.update({
      where: {
        id: subscriptionId,
        userId,
      },
      data: {
        ...data,
        remindBeforeDays: Number(data.remindBeforeDays),
      },
      include: {
        service: true,
      },
    });

    return updatedSubscription;
  } catch (error: unknown) {
    console.log(error);
  }
};

const deleteUserSubscription = async (subscriptionId: string, userId: string) => {
  try {
    const deletedSubscription = await prisma.userSubscription.delete({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    return deletedSubscription;
  } catch (error: unknown) {
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

export default SubscriptionsService;
