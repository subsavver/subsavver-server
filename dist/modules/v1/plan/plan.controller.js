"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plan_service_1 = __importDefault(require("./plan.service"));
const errorHandler_1 = require("../../../utils/errorHandler");
// Get all plans
const getPlans = async (req, res, next) => {
    try {
        const plans = await plan_service_1.default.getPlans();
        if (!plans) {
            throw new Error("Failed to fetch plans");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Plans fetched successfully",
            data: plans,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const createPlan = async (req, res, next) => {
    try {
        const body = req.body;
        // Find existing plan
        const existingPlan = await plan_service_1.default.getPlanByName(body.name);
        if (existingPlan) {
            throw new errorHandler_1.ConflictError("Plan already exists");
        }
        // Create plan
        const createdPlan = await plan_service_1.default.createPlan(body);
        if (!createdPlan) {
            throw new Error("Failed to create plan");
        }
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Plan created successfully",
            data: createdPlan,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Get plan by id
const getPlanById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new Error("Plan ID is required"));
        }
        const plan = await plan_service_1.default.getPlanById(id);
        if (!plan) {
            return next(new Error("Plan not found"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Plan fetched successfully",
            data: plan,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Update plan
const updatePlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new Error("Plan ID is required"));
        }
        const body = req.body;
        const updatedPlan = await plan_service_1.default.updatePlan(id, body);
        if (!updatedPlan) {
            throw new Error("Failed to update plan");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Plan updated successfully",
            data: updatedPlan,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Delete plan
const deletePlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new Error("Plan ID is required"));
        }
        const deletedPlan = await plan_service_1.default.deletePlan(id);
        if (!deletedPlan) {
            throw new Error("Failed to delete plan");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Plan deleted successfully",
            data: deletedPlan,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const PlanController = {
    getPlans,
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
};
exports.default = PlanController;
