import { Router } from "express";
import subscriptionServiceRoute from "../modules/v1/subscription-service/subscription-service.route";
import subscriptionsRoute from "../modules/v1/subscriptions/subscriptions.route";
import paymentsRoute from "../modules/v1/payments/payment.route";
import categoriesRoute from "../modules/v1/category/category.route";
import planRoute from "../modules/v1/plan/plan.route";
import usersRoute from "../modules/v1/users/users.route";
import dashboardRoute from "../modules/v1/dashboard/dashboard.routes";

const router: Router = Router();

const apiVersions = {
  v1: [
    {
      path: "/ai",
      handler: () => {},
    },
    {
      path: "/categories",
      handler: categoriesRoute,
    },
    {
      path: "/subscription-services",
      handler: subscriptionServiceRoute,
    },
    {
      path: "/analytics",
      handler: dashboardRoute,
    },
    {
      path: "/users",
      handler: usersRoute,
    },
    {
      path: "/subscriptions",
      handler: subscriptionsRoute,
    },
    {
      path: "/payments",
      handler: paymentsRoute,
    },
    {
      path: "/plans",
      handler: planRoute,
    },
  ],
};

for (const [version, routes] of Object.entries(apiVersions)) {
  for (const { path, handler } of routes) {
    router.use(`/${version}${path}`, handler);
  }
}

export default router;
