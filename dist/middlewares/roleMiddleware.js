"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscriptionLimit = exports.requireFeature = exports.requirePlan = exports.requirePermission = exports.authorize = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const rbac_1 = require("../config/rbac");
const config_1 = __importDefault(require("../config/config"));
const database_1 = require("../lib/database");
const authorize = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new errorHandler_1.UnauthorizedError();
            }
            const userRole = req.user?.role;
            if (!allowedRoles.includes(userRole)) {
                throw new errorHandler_1.AuthorizationError("Insufficient permissions");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.UnauthorizedError());
        }
        const userPermission = rbac_1.ROLE_PERMISSIONS[req.user.role] || [];
        if (userPermission.includes(permission)) {
            next();
        }
        else {
            next(new errorHandler_1.AuthorizationError(config_1.default.nodeEnv === "production"
                ? "Insufficient permissions"
                : `Insufficient permissions. You need: ${permission}`));
        }
    };
};
exports.requirePermission = requirePermission;
// Plan Middleware
const requirePlan = (requirePlan) => {
    const planHierarchy = {
        FREE: 0,
        PRO: 1,
        PREMIUM: 2,
    };
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.UnauthorizedError());
        }
        const userPlan = req.user?.plan?.type ?? "FREE";
        const userPlanLevel = planHierarchy[userPlan];
        const requiredPlanLevel = planHierarchy[requirePlan];
        if (userPlanLevel >= requiredPlanLevel) {
            next();
        }
        else {
            next(new errorHandler_1.AuthorizationError("Insufficient permissions"));
        }
    };
};
exports.requirePlan = requirePlan;
// Feature Middleware
const requireFeature = (feature) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new errorHandler_1.UnauthorizedError();
            }
            const userWithPlan = await database_1.prisma.user.findFirst({
                where: {
                    id: req.user.id,
                },
                include: {
                    plan: true,
                },
            });
            const userPlan = userWithPlan?.plan?.type || "FREE";
            const hasFeature = rbac_1.PLAN_PERMISSIONS[userPlan][feature];
            if (hasFeature) {
                next();
            }
            else {
                next(new errorHandler_1.AuthorizationError("Insufficient permissions"));
            }
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireFeature = requireFeature;
// Limit Subscription Middleware
const checkSubscriptionLimit = () => {
    return async (req, res, next) => {
        try {
            const userPlan = req.user?.plan?.type || "FREE";
            const maxSubscriptions = rbac_1.PLAN_PERMISSIONS[userPlan].maxSubscriptions;
            if (maxSubscriptions === Infinity) {
                next();
            }
            const subscriptionCount = await database_1.prisma.userSubscription.count({
                where: {
                    userId: req.user?.id,
                },
            });
            if (subscriptionCount >= maxSubscriptions) {
                next(new Error(`Limit reached: ${maxSubscriptions} active subscriptions on your ${userPlan} plan.`));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkSubscriptionLimit = checkSubscriptionLimit;
