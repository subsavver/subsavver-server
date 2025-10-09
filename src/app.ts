import express, { Express } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Express = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middlewares
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
