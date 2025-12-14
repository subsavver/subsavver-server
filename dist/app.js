"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./utils/errorHandler");
require("./jobs/payment.cron");
require("./jobs/reminder.cron");
require("./workers/reminder.worker");
const app = (0, express_1.default)();
// Middlewares
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(authenticate);
console.log(process.env.FRONTEND_URL);
// Routes
app.get("/", (req, res) => {
    res.send("SubSavver API!");
});
app.use("/api", routes_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.default.nodeEnv,
        version: process.env.npm_package_version || "1.0.0",
    });
});
// Error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
