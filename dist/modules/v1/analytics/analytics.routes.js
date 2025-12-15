"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("./analytics.controller");
const client_1 = require("../../../generated/client");
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const authenticate_1 = __importDefault(require("../../../middlewares/authenticate"));
const router = express_1.default.Router();
router.use(authenticate_1.default);
router.get("/overview", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER, client_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.getOverview);
router.get("/chart", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER, client_1.UserRole.ADMIN]), analytics_controller_1.AnalyticsController.getChartData);
router.get("/category-spend", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER]), analytics_controller_1.AnalyticsController.getCategorySpend);
router.get("/spending-trend", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER]), analytics_controller_1.AnalyticsController.getSpendingTrend);
router.get("/projection", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER]), analytics_controller_1.AnalyticsController.getProjection);
router.get("/top-expenses", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER]), analytics_controller_1.AnalyticsController.getTopExpenses);
exports.default = router;
