import { Router } from "express";
import SubscriptionsController from "./subscriptions.controller";
import authenticate from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/roleMiddleware";
import { validateBody } from "../../../middlewares/validation";
import { updateUserSubscriptionSchema, userSubscriptionSchema } from "./subscriptions.validation";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorize(["ADMIN"]), SubscriptionsController.getAllUserSubscriptions);

router.get("/user", authorize(["USER"]), SubscriptionsController.getUserSubscriptions);

router.post(
  "/",
  authorize(["USER"]),
  validateBody(userSubscriptionSchema),
  SubscriptionsController.createUserSubscription
);

router.patch(
  "/:id",
  authorize(["USER"]),
  validateBody(updateUserSubscriptionSchema),
  SubscriptionsController.updateUserSubscription
);

router.delete("/:id", authorize(["USER"]), SubscriptionsController.deleteUserSubscription);

export default router;
