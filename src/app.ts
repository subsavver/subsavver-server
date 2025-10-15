import express, { Express, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, Session } from "./lib/auth";
import config from "./config/config";
import routes from "./routes";
import authMiddleware from "./middlewares/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: Session["user"];
    }
  }
}

const app: Express = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middlewares
app.use(express.json());
app.use(authMiddleware);

// Routes
app.get("/", (req, res) => {
  res.send("SubSavver API!");
});
app.use("/api", routes);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || "1.0.0",
  });
});

export default app;
