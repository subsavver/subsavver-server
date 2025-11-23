import { NextFunction, Request, Response } from "express";
import { AuthorizationError, UnauthorizedError } from "../utils/errorHandler";
import { UserRole } from "../generated/client";
import { PLAN_PERMISSIONS, ROLE_PERMISSIONS } from "../config/rbac";
import config from "../config/config";
import { prisma } from "../lib/database";

export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError();
      }

      const userRole = req.user?.role;
      if (!allowedRoles.includes(userRole!)) {
        throw new AuthorizationError("Insufficient permissions");
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    const userPermission = ROLE_PERMISSIONS[req.user.role] || [];

    if (userPermission.includes(permission)) {
      next();
    } else {
      next(
        new AuthorizationError(
          config.nodeEnv === "production"
            ? "Insufficient permissions"
            : `Insufficient permissions. You need: ${permission}`
        )
      );
    }
  };
};

// Plan Middleware
export const requirePlan = (requirePlan: string) => {
  const planHierarchy: Record<string, number> = {
    FREE: 0,
    PRO: 1,
    PREMIUM: 2,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    const userPlan = req.user?.plan?.type ?? "FREE";
    const userPlanLevel = planHierarchy[userPlan];
    const requiredPlanLevel = planHierarchy[requirePlan];

    if (userPlanLevel >= requiredPlanLevel) {
      next();
    } else {
      next(new AuthorizationError("Insufficient permissions"));
    }
  };
};

// Feature Middleware
export const requireFeature = (feature: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const userWithPlan = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
        include: {
          plan: true,
        },
      });

      const userPlan = userWithPlan?.plan?.type || "FREE";

      const hasFeature = PLAN_PERMISSIONS[userPlan][feature];

      if (hasFeature) {
        next();
      } else {
        next(new AuthorizationError("Insufficient permissions"));
      }
    } catch (error: unknown) {
      next(error);
    }
  };
};

// Limit Subscription Middleware
export const checkSubscriptionLimit = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userPlan = req.user?.plan?.type || "FREE";
      const maxSubscriptions = PLAN_PERMISSIONS[userPlan].maxSubscriptions;

      if (maxSubscriptions === Infinity) {
        next();
      }

      const subscriptionCount = await prisma.userSubscription.count({
        where: {
          userId: req.user?.id,
        },
      });

      if (subscriptionCount >= maxSubscriptions) {
        next(
          new Error(
            `Limit reached: ${maxSubscriptions} active subscriptions on your ${userPlan} plan.`
          )
        );
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};
