"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_service_service_1 = __importDefault(require("./subscription-service.service"));
const errorHandler_1 = require("../../../utils/errorHandler");
const config_1 = __importDefault(require("../../../config/config"));
// Get all subscription services
const getAllSubscriptionService = async (req, res, next) => {
    try {
        const services = await subscription_service_service_1.default.getAllServices();
        if (!services) {
            const message = `Failed to fetch services`;
            throw new errorHandler_1.InternalServerError(message);
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Services fetched successfully",
            data: services,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Create subscription service
const createSubscriptionService = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const body = req.body;
        const existingService = await subscription_service_service_1.default.findByName(body.name);
        if (existingService) {
            const message = `Service ${body.name} already exists`;
            throw new errorHandler_1.ConflictError(message);
        }
        const result = await subscription_service_service_1.default.createService(body, userId);
        if (!result) {
            const message = `Failed to create service ${body.name}`;
            throw new errorHandler_1.InternalServerError(message);
        }
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Service created successfully",
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
// Get subscription service by id
const getSubscriptionServiceById = async (req, res, next) => {
    try {
        const { params } = req;
        const service = await subscription_service_service_1.default.findById(params.serviceId);
        if (!service) {
            const message = `Service not found`;
            throw new errorHandler_1.NotFoundError(message);
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Service fetched successfully",
            data: service,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const updateSubscriptionService = async (req, res, next) => {
    try {
        const { params, body } = req;
        // Check is params and body are send in the request
        if (!params || !body) {
            const message = config_1.default.isProduction
                ? "Required fields not provided"
                : "Params and body are required";
            throw new errorHandler_1.InternalServerError(message);
        }
        // Find the existing service
        const existingService = await subscription_service_service_1.default.findById(params.serviceId);
        if (!existingService) {
            throw new errorHandler_1.NotFoundError("Service not found");
        }
        // Update the service
        const updatedService = await subscription_service_service_1.default.updateService(params.serviceId, body);
        if (!updatedService) {
            throw new errorHandler_1.InternalServerError("Failed to update service");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Service updated successfully",
            data: updatedService,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteSubscriptionService = async (req, res, next) => {
    try {
        const { params } = req;
        if (!params.serviceId) {
            const message = config_1.default.isProduction
                ? "Required fields not provided"
                : "Service ID is required";
            throw new errorHandler_1.InternalServerError(message);
        }
        const deletedService = await subscription_service_service_1.default.deleteServiceById(params.serviceId);
        if (!deletedService) {
            throw new errorHandler_1.InternalServerError("Failed to delete service");
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Service deleted successfully",
            data: deletedService,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
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
exports.default = SubscriptionServiceController;
