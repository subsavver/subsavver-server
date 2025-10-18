import { Router } from "express";
import subscriptionServiceRoute from "../modules/v1/subscription-service/subscription-service.route";
import subscriptionsRoute from "../modules/v1/subscriptions/subscriptions.route";

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
      handler: () => {},
    },
  ],
};

for (const [version, routes] of Object.entries(apiVersions)) {
  for (const { path, handler } of routes) {
    router.use(`/${version}${path}`, handler);
  }
}

export default router;
