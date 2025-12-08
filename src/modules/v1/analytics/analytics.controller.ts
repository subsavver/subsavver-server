import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

const getOverview = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getStats(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
};

const getChartData = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getChartData(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard chart data retrieved successfully",
    data: result,
  });
};

const getCategorySpend = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getCategorySpend(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard category spend retrieved successfully",
    data: result,
  });
};

const getSpendingTrend = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getSpendingTrend(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard spending trend retrieved successfully",
    data: result,
  });
};

const getProjection = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getProjection(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard spending trends retrieved successfully",
    data: result,
  });
};

const getTopExpenses = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getTopExpenses(req.user?.id!);
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Dashboard top expenses retrieved successfully",
    data: result,
  });
};

export const AnalyticsController = {
  getOverview,
  getChartData,
  getCategorySpend,
  getSpendingTrend,
  getProjection,
  getTopExpenses,
};
