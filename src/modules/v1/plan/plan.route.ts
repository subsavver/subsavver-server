import { Router } from "express";
import PlanController from "./plan.controller";
import { authorize } from "../../../middlewares/roleMiddleware";
import { validateBody } from "../../../middlewares/validation";
import { createPlanSchema, updatePlanSchema } from "./plan.validation";
import authenticate from "../../../middlewares/authenticate";

const router: Router = Router();

router.use(authenticate);

// Get all plans
router.get("/", PlanController.getPlans);

// Create plan
router.post("/", authorize(["ADMIN"]), validateBody(createPlanSchema), PlanController.createPlan);

// Get plan by id
router.get("/:id", PlanController.getPlanById);

// Update plan
router.patch(
  "/:id",
  authorize(["ADMIN"]),
  validateBody(updatePlanSchema),
  PlanController.updatePlan
);

// Delete plan
router.delete("/:id", authorize(["ADMIN"]), PlanController.deletePlan);

export default router;
