"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlanSchema = exports.createPlanSchema = void 0;
const z = __importStar(require("zod"));
const client_1 = require("../../../generated/client");
exports.createPlanSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().default(0),
    currency: z.enum(client_1.Currency).default("USD"),
    interval: z.string().min(1, "Interval is required"),
    features: z.object({
        trackLimit: z.number(),
        emailReminders: z.boolean().default(false),
        monthlySummary: z.string().default("basic"),
        analytics: z.string().default("basic"),
        categoryAnalytics: z.boolean().default(false),
        customReminders: z.boolean().default(false),
        smartInsights: z.boolean().default(false),
        prioritySupport: z.boolean().default(false),
        smsWhatsAppReminders: z.boolean().default(false),
        aiInsights: z.boolean().default(false),
        dataExport: z.array(z.enum(["csv", "pdf"])).default([]),
        multipleProfiles: z.boolean().default(false),
        earlyAccess: z.boolean().default(false),
    }),
    includes: z.array(z.string()).optional(),
    isPopular: z.boolean().default(false),
    type: z.enum(["FREE", "PRO", "PREMIUM"]).default("FREE"),
});
exports.updatePlanSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().default(0),
    currency: z.enum(client_1.Currency).default("USD"),
    interval: z.string().min(1, "Interval is required"),
    features: z.object({
        trackLimit: z.number().min(0, "Max subscription must be positive"),
        emailReminders: z.boolean().default(false),
        monthlySummary: z.string().default("basic"),
        analytics: z.string().default("basic"),
        categoryAnalytics: z.boolean().default(false),
        customReminders: z.boolean().default(false),
        smartInsights: z.boolean().default(false),
        prioritySupport: z.boolean().default(false),
        smsWhatsAppReminders: z.boolean().default(false),
        aiInsights: z.boolean().default(false),
        dataExport: z.array(z.enum(["csv", "pdf"])).default([]),
        multipleProfiles: z.boolean().default(false),
        earlyAccess: z.boolean().default(false),
    }),
    type: z.enum(["FREE", "PRO", "PREMIUM"]).default("FREE"),
    includes: z.array(z.string()).optional(),
    isPopular: z.boolean().default(false),
    isActive: z.boolean().default(true),
});
