import * as z from "zod";

export const createSubscriptionServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(1, "Logo is required"),
  company: z.string().min(1, "Company is required"),
  category: z.string().optional().default("Other"),
});

export const getSubscriptionServiceByIdSchema = z.object({
  params: z.object({
    serviceId: z.string().min(1, "Service ID is required"),
  }),
  body: z.object({
    name: z.string().min(1, "Name is required"),
    logo: z.string().min(1, "Logo is required"),
    company: z.string().min(1, "Company is required"),
    category: z.string().optional().default("Other"),
  }),
});

export type CreateSubscriptionServiceInput = z.infer<typeof createSubscriptionServiceSchema>;
export type GetSubscriptionServiceByIdInput = z.infer<typeof getSubscriptionServiceByIdSchema>;

// model SubscriptionService {
//   id        String             @id @default(uuid())
//   name      String             @unique
//   logo      String
//   category  String?
//   createdBy String // Admin ID
//   createdAt DateTime           @default(now())
//   updatedAt DateTime           @updatedAt
//   users     UserSubscription[]
// }
