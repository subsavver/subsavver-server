"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_service_controller_1 = __importDefault(require("./subscription-service.controller"));
const authenticate_1 = __importDefault(require("../../../middlewares/authenticate"));
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const validation_1 = require("../../../middlewares/validation");
const subscription_service_validation_1 = require("./subscription-service.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.default);
router.get("/", subscription_service_controller_1.default.getAllSubscriptionService);
router.post("/", (0, roleMiddleware_1.authorize)(["ADMIN"]), (0, validation_1.validateBody)(subscription_service_validation_1.createSubscriptionServiceSchema), subscription_service_controller_1.default.createSubscriptionService);
router.get("/:serviceId", subscription_service_controller_1.default.getSubscriptionServiceById);
router.patch("/:serviceId", (0, roleMiddleware_1.authorize)(["ADMIN"]), subscription_service_controller_1.default.updateSubscriptionService);
router.delete("/:serviceId", (0, roleMiddleware_1.authorize)(["ADMIN"]), subscription_service_controller_1.default.deleteSubscriptionService);
exports.default = router;
