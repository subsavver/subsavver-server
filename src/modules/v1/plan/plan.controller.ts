import { NextFunction, Request, Response } from "express";
import PlanService from "./plan.service";
import { ConflictError } from "../../../utils/errorHandler";

// Get all plans
const getPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await PlanService.getPlans();

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
  } catch (error: unknown) {
    next(error);
  }
};

const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    // Find existing plan
    const existingPlan = await PlanService.getPlanByName(body.name);

    if (existingPlan) {
      throw new ConflictError("Plan already exists");
    }

    // Create plan
    const createdPlan = await PlanService.createPlan(body);

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
  } catch (error: unknown) {
    next(error);
  }
};

// Get plan by id
const getPlanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new Error("Plan ID is required"));
    }

    const plan = await PlanService.getPlanById(id);

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
  } catch (error: unknown) {
    next(error);
  }
};

// Update plan
const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new Error("Plan ID is required"));
    }

    const body = req.body;

    const updatedPlan = await PlanService.updatePlan(id, body);

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
  } catch (error: unknown) {
    next(error);
  }
};

// Delete plan
const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new Error("Plan ID is required"));
    }

    const deletedPlan = await PlanService.deletePlan(id);

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
  } catch (error: unknown) {
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

export default PlanController;
