"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env;
const config = {
    port: Number(env.PORT) || 7000,
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
    nodeEnv: env.NODE_ENV || "development",
    frontendUrl: env.FRONTEND_URL || "http://localhost:3000",
    backendUrl: env.BACKEND_URL || "http://localhost:8000",
    gmail: {
        user: env.GMAIL_USER || "",
        pass: env.GMAIL_PASS || "",
    },
    cloudinary: {
        cloudName: env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: env.CLOUDINARY_API_KEY || "",
        apiSecret: env.CLOUDINARY_API_SECRET || "",
    },
    redis: {
        url: env.UPSTASH_REDIS_URL || "redis://localhost:6379",
        password: env.UPSTASH_REDIS_PASS || "",
    },
    jwt_secret: env.JWT_SECRET || "",
};
exports.default = config;
