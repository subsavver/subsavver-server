"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_service_route_1 = __importDefault(require("../modules/v1/subscription-service/subscription-service.route"));
const subscriptions_route_1 = __importDefault(require("../modules/v1/subscriptions/subscriptions.route"));
const payment_route_1 = __importDefault(require("../modules/v1/payments/payment.route"));
const category_route_1 = __importDefault(require("../modules/v1/category/category.route"));
const plan_route_1 = __importDefault(require("../modules/v1/plan/plan.route"));
const users_route_1 = __importDefault(require("../modules/v1/users/users.route"));
const analytics_routes_1 = __importDefault(require("../modules/v1/analytics/analytics.routes"));
const router = (0, express_1.Router)();
const apiVersions = {
    v1: [
        {
            path: "/ai",
            handler: () => { },
        },
        {
            path: "/categories",
            handler: category_route_1.default,
        },
        {
            path: "/subscription-services",
            handler: subscription_service_route_1.default,
        },
        {
            path: "/analytics",
            handler: analytics_routes_1.default,
        },
        {
            path: "/users",
            handler: users_route_1.default,
        },
        {
            path: "/subscriptions",
            handler: subscriptions_route_1.default,
        },
        {
            path: "/payments",
            handler: payment_route_1.default,
        },
        {
            path: "/plans",
            handler: plan_route_1.default,
        },
    ],
};
for (const [version, routes] of Object.entries(apiVersions)) {
    for (const { path, handler } of routes) {
        router.use(`/${version}${path}`, handler);
    }
}
exports.default = router;
