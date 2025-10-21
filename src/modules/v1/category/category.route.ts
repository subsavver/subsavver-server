import { Router } from "express";
import { authorize } from "../../../middlewares/roleMiddleware";
import CategoryController from "./category.controller";
import { validateBody } from "../../../middlewares/validation";
import { createCategorySchema } from "./category.validation";

const router: Router = Router();

router.get("/", CategoryController.getCategories);

router.post(
  "/",
  authorize(["ADMIN"]),
  validateBody(createCategorySchema),
  CategoryController.createCategory
);

router.get("/:id", authorize(["ADMIN"]), CategoryController.getCategoryById);

router.patch(
  "/:id",
  authorize(["ADMIN"]),
  validateBody(createCategorySchema),
  CategoryController.updateCategory
);

router.delete("/:id", authorize(["ADMIN"]), CategoryController.deleteCategory);

export default router;
