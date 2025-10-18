import { NextFunction, Request, Response } from "express";
import { User } from "../../../generated/prisma";
import { InternalServerError, NotFoundError, UnauthorizedError } from "../../../utils/errorHandler";
import { prisma } from "../../../lib/database";
import { REMIND_BEFORE_DAYS } from "../../../constants";
import { UpdateUserSubscription, UserSubscription } from "./subscriptions.validation";
import SubscriptionsService from "./subscriptions.service";

// Get all subscriptions
const getAllUserSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await SubscriptionsService.getUserSubscriptions();

    if (!subscriptions) {
      throw new NotFoundError("No subscriptions found");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Subscriptions fetched successfully",
      data: subscriptions,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

// Create subscription
const createUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const body = req.body as UserSubscription;

    if (!user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const subscription = await SubscriptionsService.createUserSubscription(body, user.id);

    // Create default remainder
    const notifyAt = new Date(
      new Date(subscription?.renewalDate as Date).getTime() -
        REMIND_BEFORE_DAYS * 24 * 60 * 60 * 1000
    );

    await prisma.reminder.create({
      data: {
        userId: user.id,
        subscriptionId: subscription?.id as string,
        remindBeforeDays: REMIND_BEFORE_DAYS,
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
  } catch (error: unknown) {
    next(error);
  }
};

const updateUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateUserSubscription;
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingSubscription) {
      throw new NotFoundError("Subscription not found");
    }

    const updatedSubscription = await SubscriptionsService.updateUserSubscription(
      id,
      user.id,
      body
    );

    if (!updatedSubscription) {
      throw new NotFoundError("Subscription not found");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Subscription updated successfully",
      data: updatedSubscription,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const deleteUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingSubscription) {
      throw new NotFoundError("Subscription not found");
    }

    const deletedSubscription = await SubscriptionsService.deleteUserSubscription(id, user.id);

    if (!deletedSubscription) {
      throw new InternalServerError("Failed to delete subscription");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Subscription deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const SubscriptionsController = {
  getAllUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
};

export default SubscriptionsController;
