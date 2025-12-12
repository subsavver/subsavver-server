"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const client_1 = require("../../../generated/client");
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get("/overview", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER, client_1.UserRole.ADMIN]), dashboard_controller_1.DashboardController.getOverview);
router.get("/chart", (0, roleMiddleware_1.authorize)([client_1.UserRole.USER, client_1.UserRole.ADMIN]), dashboard_controller_1.DashboardController.getChartData);
exports.default = router;
