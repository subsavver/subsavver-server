import * as z from "zod";
import { Currency } from "../../../generated/client";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().default(0),
  currency: z.enum(Currency).default("USD"),
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

export const updatePlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().default(0),
  currency: z.enum(Currency).default("USD"),
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

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
