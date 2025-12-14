"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
const getOverview = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getStats(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
};
const getChartData = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getChartData(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard chart data retrieved successfully",
        data: result,
    });
};
const getCategorySpend = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getCategorySpend(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard category spend retrieved successfully",
        data: result,
    });
};
const getSpendingTrend = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getSpendingTrend(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard spending trend retrieved successfully",
        data: result,
    });
};
const getProjection = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getProjection(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard spending trends retrieved successfully",
        data: result,
    });
};
const getTopExpenses = async (req, res) => {
    const result = await analytics_service_1.AnalyticsService.getTopExpenses(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard top expenses retrieved successfully",
        data: result,
    });
};
exports.AnalyticsController = {
    getOverview,
    getChartData,
    getCategorySpend,
    getSpendingTrend,
    getProjection,
    getTopExpenses,
};
