import z from "zod";

export const userSubscriptionSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  planName: z.string().min(1, "Plan name is required"),
  amount: z.number().min(1, "Amount is required"),
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
  amount: z.number().min(1, "Amount is required"),
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
