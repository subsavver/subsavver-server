import express, { Express, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import config from "./config/config";
import routes from "./routes";

const app: Express = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middlewares
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
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
