"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const getOverview = async (req, res) => {
    const result = await dashboard_service_1.DashboardService.getStats(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
};
const getChartData = async (req, res) => {
    const result = await dashboard_service_1.DashboardService.getChartData(req.user?.id);
    return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Dashboard chart data retrieved successfully",
        data: result,
    });
};
exports.DashboardController = {
    getOverview,
    getChartData,
};
