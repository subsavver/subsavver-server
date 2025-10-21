import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";
import { ConflictError, NotFoundError } from "../../../utils/errorHandler";
import { CreateCategoryInput } from "./category.validation";

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getCategories();

    if (!categories) {
      return next(new NotFoundError("No categories found"));
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Categories fetched successfully",
      data: categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateCategoryInput;

    const existingCategory = await CategoryService.getCategoryByName(body.name);

    if (existingCategory) {
      return next(new ConflictError("Category with this name already exists"));
    }

    const createdCategory = await CategoryService.createCategory(body);

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
  } catch (error: unknown) {
    next(error);
  }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation will go here
  try {
    const { id } = req.params;

    if (!id) {
      return next(new NotFoundError("Category ID is required"));
    }

    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return next(new NotFoundError("Category not found"));
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Category fetched successfully",
      data: category,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new NotFoundError("Category ID is required"));
    }

    const body = req.body as CreateCategoryInput;

    const updatedCategory = await CategoryService.updateCategory(id, body);

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
  } catch (error: unknown) {
    next(error);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new NotFoundError("Category ID is required"));
    }

    const deletedCategory = await CategoryService.deleteCategory(id);

    if (!deletedCategory) {
      return next(new Error("Failed to delete category"));
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Category deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
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

export default CategoryController;
