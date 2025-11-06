import { prisma } from "../../../lib/database";
import { CreatePlanInput, UpdatePlanInput } from "./plan.validation";

// Get all plans
const getPlans = async () => {
  try {
    const plans = await prisma.plan.findMany();
    return plans;
  } catch (error: unknown) {
    console.log(error);
  }
};

// Create Plan
const createPlan = async (body: CreatePlanInput) => {
  try {
    const createdPlan = await prisma.plan.create({
      data: {
        name: body.name,
        price: body.price,
        currency: body.currency,
        interval: body.interval,
        features: body.features,
        type: body.type,
        includes: body.includes,
      },
    });

    return createdPlan;
  } catch (error: unknown) {
    console.log(error);
  }
};

// Get plan by name
const getPlanByName = async (name: string) => {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        name,
      },
    });

    return plan;
  } catch (error: unknown) {
    console.log("Error getting plan by name: ", error);
  }
};

// Get plan by id
const getPlanById = async (id: string) => {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        id,
      },
    });

    return plan;
  } catch (error: unknown) {
    console.log("Error getting plan by id: ", error);
  }
};

// Update plan
const updatePlan = async (id: string, body: UpdatePlanInput) => {
  try {
    const updatedPlan = await prisma.plan.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        price: body.price,
        currency: body.currency,
        interval: body.interval,
        features: body.features,
        type: body.type,
        isActive: body.isActive,
        isPopular: body.isPopular,
        includes: body.includes,
      },
    });

    return updatedPlan;
  } catch (error: unknown) {
    console.log("Error updating plan: ", error);
  }
};

// Delete plan
const deletePlan = async (id: string) => {
  try {
    const deletedPlan = await prisma.plan.delete({
      where: {
        id,
      },
    });

    return deletedPlan;
  } catch (error: unknown) {
    console.log("Error deleting plan: ", error);
  }
};

const PlanService = {
  getPlans,
  createPlan,
  getPlanByName,
  getPlanById,
  updatePlan,
  deletePlan,
};

export default PlanService;
