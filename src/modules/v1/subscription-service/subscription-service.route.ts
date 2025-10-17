import { Router } from "express";
import SubscriptionServiceController from "./subscription-service.controller";
import authenticate from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/roleMiddleware";
import { validateBody } from "../../../middlewares/validation";
import { createSubscriptionServiceSchema } from "./subscription-service.validation";

const router: Router = Router();

router.use(authenticate);

router.get("/", SubscriptionServiceController.getAllSubscriptionService);

router.post(
  "/",
  authorize(["admin"]),
  validateBody(createSubscriptionServiceSchema),
  SubscriptionServiceController.createSubscriptionService
);

router.get("/:serviceId", SubscriptionServiceController.getSubscriptionServiceById);

router.patch(
  "/:serviceId",
  authorize(["admin"]),
  SubscriptionServiceController.updateSubscriptionService
);

router.delete(
  "/:serviceId",
  authorize(["admin"]),
  SubscriptionServiceController.deleteSubscriptionService
);

export default router;
