import { Request } from "express";
import { Session } from "../typescript";

type User = Session["user"];

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
