import express from "express";
import { DashboardController } from "./dashboard.controller";
import { UserRole } from "../../../generated/client";
import { authorize } from "../../../middlewares/roleMiddleware";

const router = express.Router();

router.get(
  "/overview",
  authorize([UserRole.USER, UserRole.ADMIN]),
  DashboardController.getOverview
);

router.get("/chart", authorize([UserRole.USER, UserRole.ADMIN]), DashboardController.getChartData);

export default router;
