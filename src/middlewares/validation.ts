import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ValidationError } from "../utils/errorHandler";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        console.log(formattedErrors);

        throw new ValidationError("Validation failed");
      }
      next(error);
    }
  };
};
