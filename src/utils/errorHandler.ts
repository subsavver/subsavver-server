import { NextFunction, Request, Response } from "express";
import config from "../config/config";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code || "INTERNAL_ERROR";

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400, true, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, true, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, true, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, true, "NOT_FOUND_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, true, "CONFLICT_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, true, "RATE_LIMIT_ERROR");
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500, true, "INTERNAL_SERVER_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, true, "UNAUTHORIZED_ERROR");
  }
}

// Global error handler
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    success: false,
    message: config.isProduction ? "Internal server error" : error.message,
    timestamp: new Date().toISOString(),
  });
};
