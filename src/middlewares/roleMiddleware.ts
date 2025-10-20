import { NextFunction, Request, Response } from "express";
import { AuthorizationError, UnauthorizedError } from "../utils/errorHandler";
import { UserRole } from "../generated/prisma";

export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError();
      }

      if (!user.role || !allowedRoles.includes(user.role as UserRole)) {
        throw new AuthorizationError();
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};
