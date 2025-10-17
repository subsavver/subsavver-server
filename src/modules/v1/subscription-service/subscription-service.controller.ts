import { NextFunction, Request, Response } from "express";
import SubscriptionService from "./subscription-service.service";
import {
  CreateSubscriptionServiceInput,
  GetSubscriptionServiceByIdInput,
} from "./subscription-service.validation";
import { ConflictError, InternalServerError, NotFoundError } from "../../../utils/errorHandler";
import config from "../../../config/config";

// Get all subscription services
const getAllSubscriptionService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await SubscriptionService.getAllServices();
    if (!services) {
      const message = `Failed to fetch services`;
      throw new InternalServerError(message);
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Services fetched successfully",
      data: services,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

// Create subscription service
const createSubscriptionService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const body = req.body as CreateSubscriptionServiceInput;

    const existingService = await SubscriptionService.findByName(body.name);

    if (existingService) {
      const message = `Service ${body.name} already exists`;
      throw new ConflictError(message);
    }

    const result = await SubscriptionService.createService(body, userId);

    if (!result) {
      const message = `Failed to create service ${body.name}`;
      throw new InternalServerError(message);
    }

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Service created successfully",
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

// Get subscription service by id
const getSubscriptionServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req as unknown as GetSubscriptionServiceByIdInput;

    const service = await SubscriptionService.findById(params.serviceId);

    if (!service) {
      const message = `Service not found`;
      throw new NotFoundError(message);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Service fetched successfully",
      data: service,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const updateSubscriptionService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, body } = req as unknown as GetSubscriptionServiceByIdInput;

    // Check is params and body are send in the request
    if (!params || !body) {
      const message = config.isProduction
        ? "Required fields not provided"
        : "Params and body are required";
      throw new InternalServerError(message);
    }

    // Find the existing service
    const existingService = await SubscriptionService.findById(params.serviceId);

    if (!existingService) {
      throw new NotFoundError("Service not found");
    }

    // Update the service
    const updatedService = await SubscriptionService.updateService(params.serviceId, body);

    if (!updatedService) {
      throw new InternalServerError("Failed to update service");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Service updated successfully",
      data: updatedService,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const deleteSubscriptionService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req as unknown as GetSubscriptionServiceByIdInput;

    if (!params.serviceId) {
      const message = config.isProduction
        ? "Required fields not provided"
        : "Service ID is required";
      throw new InternalServerError(message);
    }

    const deletedService = await SubscriptionService.deleteServiceById(params.serviceId);

    if (!deletedService) {
      throw new InternalServerError("Failed to delete service");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Service deleted successfully",
      data: deletedService,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

const SubscriptionServiceController = {
  getAllSubscriptionService,
  createSubscriptionService,
  getSubscriptionServiceById,
  updateSubscriptionService,
  deleteSubscriptionService,
};

export default SubscriptionServiceController;
