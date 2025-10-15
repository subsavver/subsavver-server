import { NextFunction, Request, Response } from "express";
import { AuthorizationError, UnauthorizedError } from "../utils/errorHandler";

export const authorize = (allowedRoles: ("user" | "admin")[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    if (!user.role || !allowedRoles.includes(user.role as "user" | "admin")) {
      throw new AuthorizationError();
    }

    next();
  };
};
