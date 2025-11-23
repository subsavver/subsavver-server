import {
  Account,
  Payment,
  Plan,
  Reminder,
  Session,
  SpendingHistory,
  Subscription,
  UserAnalytics,
  UserRole,
  UserSubscription,
} from "../generated/client";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  imagePublicId?: string | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  planId?: string | null;
  subscriptionId?: string | null;

  // Relations (optional - can be included when needed)
  sessions?: Session[];
  accounts?: Account[];
  plan?: Plan | null;
  subscription?: Subscription | null;
  subscriptions?: UserSubscription[];
  reminder?: Reminder[];
  spendingHistory?: SpendingHistory[];
  userAnalytics?: UserAnalytics | null;
  payment?: Payment[];
};
