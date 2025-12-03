import z from "zod";

export const userSubscriptionSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  planName: z.string().min(1, "Plan name is required"),
  remindBeforeDays: z.string().min(1, "Remind before days is required"),
  amount: z.number().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  renewalDate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date",
    })
  ),
  notes: z.string().optional(),
});

export const updateUserSubscriptionSchema = z.object({
  id: z.string().min(1, "Subscription ID is required"),
  planName: z.string().min(1, "Plan name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  remindBeforeDays: z.string().min(1, "Remind before days is required"),
  amount: z.number().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  isActive: z.boolean().optional(),
  renewalDate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date",
    })
  ),
  notes: z.string().optional(),
});

export type UserSubscription = z.infer<typeof userSubscriptionSchema>;
export type UpdateUserSubscription = z.infer<typeof updateUserSubscriptionSchema>;
