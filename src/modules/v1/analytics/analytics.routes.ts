import express from "express";
import { AnalyticsController } from "./analytics.controller";
import { UserRole } from "../../../generated/client";
import { authorize } from "../../../middlewares/roleMiddleware";
import authenticate from "../../../middlewares/authenticate";

const router = express.Router();

router.use(authenticate);

router.get(
  "/overview",
  authorize([UserRole.USER, UserRole.ADMIN]),
  AnalyticsController.getOverview
);

router.get("/chart", authorize([UserRole.USER, UserRole.ADMIN]), AnalyticsController.getChartData);

router.get("/category-spend", authorize([UserRole.USER]), AnalyticsController.getCategorySpend);

router.get("/spending-trend", authorize([UserRole.USER]), AnalyticsController.getSpendingTrend);

router.get("/projection", authorize([UserRole.USER]), AnalyticsController.getProjection);

router.get("/top-expenses", authorize([UserRole.USER]), AnalyticsController.getTopExpenses);

export default router;
