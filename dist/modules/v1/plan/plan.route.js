"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_controller_1 = __importDefault(require("./plan.controller"));
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const validation_1 = require("../../../middlewares/validation");
const plan_validation_1 = require("./plan.validation");
const router = (0, express_1.Router)();
// Get all plans
router.get("/", plan_controller_1.default.getPlans);
// Create plan
router.post("/", (0, roleMiddleware_1.authorize)(["ADMIN"]), (0, validation_1.validateBody)(plan_validation_1.createPlanSchema), plan_controller_1.default.createPlan);
// Get plan by id
router.get("/:id", plan_controller_1.default.getPlanById);
// Update plan
router.patch("/:id", (0, roleMiddleware_1.authorize)(["ADMIN"]), (0, validation_1.validateBody)(plan_validation_1.updatePlanSchema), plan_controller_1.default.updatePlan);
// Delete plan
router.delete("/:id", (0, roleMiddleware_1.authorize)(["ADMIN"]), plan_controller_1.default.deletePlan);
exports.default = router;
