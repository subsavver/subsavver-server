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

const getUserSubscriptions = async (userId: string) => {
  try {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscriptions;
  } catch (error: unknown) {
    console.log(error);
  }
};

const createUserSubscription = async (body: UserSubscription, userId: string) => {
  try {
    const createdSubscription = await prisma.userSubscription.create({
      data: {
        ...body,
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
      data,
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
