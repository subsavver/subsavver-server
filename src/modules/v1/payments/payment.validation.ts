import z from "zod";
import { CURRENCIES, PAYMENT_PROVIDERS, PAYMENT_STATUSES } from "../../../constants";

export const createPaymentSchema = z.object({
  userId: z.string().optional(),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  amount: z.number().min(1, "Amount is required"),
  currency: z.enum(CURRENCIES).default("USD"),
  paymentProvider: z.enum(PAYMENT_PROVIDERS).default("STRIPE"),
  paymentStatus: z.enum(PAYMENT_STATUSES).default("PENDING"),
  paidAt: z.coerce.date().optional(),
  isPaid: z.boolean().optional().default(true),
});

export const updatePaymentSchema = z.object({
  amount: z.number().min(1, "Amount is required"),
  currency: z.enum(CURRENCIES).default("USD"),
  paymentProvider: z.enum(PAYMENT_PROVIDERS).default("STRIPE"),
  paymentStatus: z.enum(PAYMENT_STATUSES).default("PENDING"),
  paidAt: z.coerce.date().optional(),
  isPaid: z.boolean().optional().default(true),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
