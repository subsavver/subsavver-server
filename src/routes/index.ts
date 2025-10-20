import { Router } from "express";
import subscriptionServiceRoute from "../modules/v1/subscription-service/subscription-service.route";
import subscriptionsRoute from "../modules/v1/subscriptions/subscriptions.route";
import paymentsRoute from "../modules/v1/payments/payment.route";

const router: Router = Router();

const apiVersions = {
  v1: [
    {
      path: "/subscription-services",
      handler: subscriptionServiceRoute,
    },
    {
      path: "/ai",
      handler: () => {},
    },
    {
      path: "/analytics",
      handler: () => {},
    },
    {
      path: "/users",
      handler: () => {},
    },
    {
      path: "/subscriptions",
      handler: subscriptionsRoute,
    },
    {
      path: "/payments",
      handler: paymentsRoute,
    },
  ],
};

for (const [version, routes] of Object.entries(apiVersions)) {
  for (const { path, handler } of routes) {
    router.use(`/${version}${path}`, handler);
  }
}

export default router;
