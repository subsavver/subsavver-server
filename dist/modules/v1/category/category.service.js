"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../lib/database");
const getCategories = async () => {
    const categories = await database_1.prisma.category.findMany({
        include: {
            subscriptionService: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    company: true,
                },
                orderBy: {
                    name: "asc",
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
    return categories;
};
const createCategory = async (data) => {
    const category = await database_1.prisma.category.create({
        data,
    });
    return category;
};
const getCategoryByName = async (name) => {
    const category = await database_1.prisma.category.findFirst({
        where: {
            name,
        },
    });
    return category;
};
const getCategoryById = async (id) => {
    const category = await database_1.prisma.category.findFirst({
        where: {
            id,
        },
    });
    return category;
};
const updateCategory = async (id, data) => {
    const category = await database_1.prisma.category.update({
        where: {
            id,
        },
        data,
    });
    return category;
};
const deleteCategory = async (id) => {
    const deletedCategory = await database_1.prisma.category.delete({
        where: {
            id,
        },
    });
    return deletedCategory;
};
const CategoryService = {
    getCategories,
    createCategory,
    getCategoryByName,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
exports.default = CategoryService;
