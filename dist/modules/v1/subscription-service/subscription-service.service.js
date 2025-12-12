"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../lib/database");
const getAllServices = async () => {
    try {
        const services = await database_1.prisma.subscriptionService.findMany();
        return services;
    }
    catch (error) {
        console.log(error);
    }
};
const createService = async (body, userId) => {
    try {
        const createdService = await database_1.prisma.subscriptionService.create({
            data: {
                name: body.name,
                logo: body.logo,
                company: body.company,
                categoryId: body.category,
                createdBy: userId,
            },
        });
        if (!createdService) {
            return null;
        }
        return createdService;
    }
    catch (error) {
        console.log(error);
    }
};
// Find service by name
const findByName = async (name) => {
    try {
        const service = await database_1.prisma.subscriptionService.findFirst({
            where: {
                name,
            },
        });
        return service;
    }
    catch (error) {
        console.log(error);
    }
};
// Find service by id
const findById = async (id) => {
    try {
        const service = await database_1.prisma.subscriptionService.findFirst({
            where: {
                id,
            },
        });
        return service;
    }
    catch (error) {
        console.log(error);
    }
};
const updateService = async (id, body) => {
    try {
        const updatedService = await database_1.prisma.subscriptionService.update({
            where: {
                id,
            },
            data: {
                name: body.name,
                logo: body.logo,
                company: body.company,
                categoryId: body.category,
            },
        });
        return updatedService;
    }
    catch (error) {
        console.log(error);
    }
};
const deleteServiceById = async (id) => {
    try {
        const deletedService = await database_1.prisma.subscriptionService.delete({
            where: {
                id,
                users: {
                    none: {},
                },
            },
        });
        return deletedService;
    }
    catch (error) {
        console.log(error);
    }
};
const SubscriptionService = {
    getAllServices,
    createService,
    findByName,
    findById,
    updateService,
    deleteServiceById,
};
exports.default = SubscriptionService;
