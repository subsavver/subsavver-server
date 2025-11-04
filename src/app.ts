import express, { Express, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth, Session } from "./lib/auth";
import config from "./config/config";
import routes from "./routes";
import authenticate from "./middlewares/authenticate";
import { errorHandler } from "./utils/errorHandler";
import "./jobs/payment.cron";
import "./jobs/reminder.cron";

declare global {
  namespace Express {
    interface Request {
      user?: Session["user"];
    }
  }
}

const app: Express = express();

// Middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string, "http://192.168.0.103:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(authenticate);

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

// Error handler
app.use(errorHandler);

export default app;
