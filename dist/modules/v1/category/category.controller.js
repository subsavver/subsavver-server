"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_service_1 = __importDefault(require("./category.service"));
const errorHandler_1 = require("../../../utils/errorHandler");
const getCategories = async (req, res, next) => {
    try {
        const categories = await category_service_1.default.getCategories();
        if (!categories) {
            return next(new errorHandler_1.NotFoundError("No categories found"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Categories fetched successfully",
            data: categories,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const createCategory = async (req, res, next) => {
    try {
        const body = req.body;
        const existingCategory = await category_service_1.default.getCategoryByName(body.name);
        if (existingCategory) {
            return next(new errorHandler_1.ConflictError("Category with this name already exists"));
        }
        const createdCategory = await category_service_1.default.createCategory(body);
        if (!createdCategory) {
            return next(new Error("Failed to create category"));
        }
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Service created successfully",
            data: createdCategory,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const getCategoryById = async (req, res, next) => {
    // Implementation will go here
    try {
        const { id } = req.params;
        if (!id) {
            return next(new errorHandler_1.NotFoundError("Category ID is required"));
        }
        const category = await category_service_1.default.getCategoryById(id);
        if (!category) {
            return next(new errorHandler_1.NotFoundError("Category not found"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Category fetched successfully",
            data: category,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new errorHandler_1.NotFoundError("Category ID is required"));
        }
        const body = req.body;
        const updatedCategory = await category_service_1.default.updateCategory(id, body);
        if (!updatedCategory) {
            return next(new Error("Failed to update category"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Category updated successfully",
            data: updatedCategory,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new errorHandler_1.NotFoundError("Category ID is required"));
        }
        const deletedCategory = await category_service_1.default.deleteCategory(id);
        if (!deletedCategory) {
            return next(new Error("Failed to delete category"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Category deleted successfully",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const CategoryController = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
exports.default = CategoryController;
