import { Router } from "express";
import SubscriptionsController from "./subscriptions.controller";
import authenticate from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/roleMiddleware";
import { validateBody } from "../../../middlewares/validation";
import { updateUserSubscriptionSchema, userSubscriptionSchema } from "./subscriptions.validation";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorize(["admin"]), SubscriptionsController.getAllUserSubscriptions);

router.post(
  "/",
  authorize(["user"]),
  validateBody(userSubscriptionSchema),
  SubscriptionsController.createUserSubscription
);

router.patch(
  "/:id",
  authorize(["user"]),
  validateBody(updateUserSubscriptionSchema),
  SubscriptionsController.updateUserSubscription
);

router.delete("/:id", authorize(["user"]), SubscriptionsController.deleteUserSubscription);

export default router;
