import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const getOverview = async (req: Request, res: Response) => {
  const result = await DashboardService.getStats(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
};

const getChartData = async (req: Request, res: Response) => {
  const result = await DashboardService.getChartData(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard chart data retrieved successfully",
    data: result,
  });
};

export const DashboardController = {
  getOverview,
  getChartData,
};
