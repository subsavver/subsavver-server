"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../lib/database");
// Get all plans
const getPlans = async () => {
    try {
        const plans = await database_1.prisma.plan.findMany();
        return plans;
    }
    catch (error) {
        console.log(error);
    }
};
// Create Plan
const createPlan = async (body) => {
    try {
        const createdPlan = await database_1.prisma.plan.create({
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
    }
    catch (error) {
        console.log(error);
    }
};
// Get plan by name
const getPlanByName = async (name) => {
    try {
        const plan = await database_1.prisma.plan.findFirst({
            where: {
                name,
            },
        });
        return plan;
    }
    catch (error) {
        console.log("Error getting plan by name: ", error);
    }
};
// Get plan by id
const getPlanById = async (id) => {
    try {
        const plan = await database_1.prisma.plan.findFirst({
            where: {
                id,
            },
        });
        return plan;
    }
    catch (error) {
        console.log("Error getting plan by id: ", error);
    }
};
// Update plan
const updatePlan = async (id, body) => {
    try {
        const updatedPlan = await database_1.prisma.plan.update({
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
    }
    catch (error) {
        console.log("Error updating plan: ", error);
    }
};
// Delete plan
const deletePlan = async (id) => {
    try {
        const deletedPlan = await database_1.prisma.plan.delete({
            where: {
                id,
            },
        });
        return deletedPlan;
    }
    catch (error) {
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
exports.default = PlanService;
