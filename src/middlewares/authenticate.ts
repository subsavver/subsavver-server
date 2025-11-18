import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/database";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
      include: {
        plan: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.banned && new Date(user.banExpires!) > new Date()) {
      return res.status(403).json({
        error: `Account suspended. Reason: ${user.banReason}. Expires: ${user.banExpires}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
