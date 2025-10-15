import { NextFunction, Request, Response } from "express";
import { auth, Session } from "../lib/auth";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });
    if (session && session.user) {
      req.user = session.user as Session["user"];
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
