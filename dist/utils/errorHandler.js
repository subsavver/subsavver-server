"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.UnauthorizedError = exports.InternalServerError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
const config_1 = __importDefault(require("../config/config"));
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code || "INTERNAL_ERROR";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Predefined error types
class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400, true, "VALIDATION_ERROR");
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = "Authentication failed") {
        super(message, 401, true, "AUTHENTICATION_ERROR");
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = "Access denied") {
        super(message, 403, true, "AUTHORIZATION_ERROR");
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, true, "NOT_FOUND_ERROR");
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = "Resource conflict") {
        super(message, 409, true, "CONFLICT_ERROR");
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = "Too many requests") {
        super(message, 429, true, "RATE_LIMIT_ERROR");
    }
}
exports.RateLimitError = RateLimitError;
class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, true, "INTERNAL_SERVER_ERROR");
    }
}
exports.InternalServerError = InternalServerError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, true, "UNAUTHORIZED_ERROR");
    }
}
exports.UnauthorizedError = UnauthorizedError;
// Global error handler
const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            success: false,
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
        });
    }
    return res.status(500).json({
        success: false,
        message: config_1.default.isProduction ? "Internal server error" : error.message,
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
