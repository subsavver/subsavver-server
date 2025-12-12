"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_PRICING = exports.PLAN_FEATURES = exports.ROLE_PERMISSIONS = exports.PLAN_PERMISSIONS = exports.ROLES = void 0;
const ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
};
exports.ROLES = ROLES;
const PLAN_PERMISSIONS = {
    FREE: {
        maxSubscriptions: 5,
        reminderTypes: ["EMAIL"],
        analytics: "basic",
        support: "standard",
        devices: "all",
        categoryAnalytics: false,
        customReminders: false,
        smartSpendTracking: false,
        aiInsights: false,
        dataExport: false,
        multipleProfiles: false,
        earlyAccess: false,
        // Feature flags for easier checking
        features: {
            unlimitedSubscriptions: false,
            advancedCategoryAnalytics: false,
            customReminders: false,
            smartSpendTracking: false,
            prioritySupport: false,
            smsReminders: false,
            whatsappReminders: false,
            aiWasteDetection: false,
            csvExport: false,
            multipleProfiles: false,
            earlyAccess: false,
        },
    },
    PRO: {
        maxSubscriptions: Infinity, // Unlimited
        reminderTypes: ["EMAIL"],
        analytics: "advanced",
        support: "priority",
        devices: "all",
        categoryAnalytics: true,
        customReminders: true,
        smartSpendTracking: true,
        aiInsights: false,
        dataExport: false,
        multipleProfiles: false,
        earlyAccess: false,
        features: {
            unlimitedSubscriptions: true,
            advancedCategoryAnalytics: true,
            customReminders: true,
            smartSpendTracking: true,
            prioritySupport: true,
            smsReminders: false,
            whatsappReminders: false,
            aiWasteDetection: false,
            csvExport: false,
            multipleProfiles: false,
            earlyAccess: false,
        },
    },
    PREMIUM: {
        maxSubscriptions: Infinity, // Unlimited
        reminderTypes: ["EMAIL", "SMS", "WHATSAPP"],
        analytics: "premium",
        support: "priority",
        devices: "all",
        categoryAnalytics: true,
        customReminders: true,
        smartSpendTracking: true,
        aiInsights: true,
        dataExport: true,
        multipleProfiles: true,
        earlyAccess: true,
        features: {
            unlimitedSubscriptions: true,
            advancedCategoryAnalytics: true,
            customReminders: true,
            smartSpendTracking: true,
            prioritySupport: true,
            smsReminders: true,
            whatsappReminders: true,
            aiWasteDetection: true,
            csvExport: true,
            multipleProfiles: true,
            earlyAccess: true,
        },
    },
};
exports.PLAN_PERMISSIONS = PLAN_PERMISSIONS;
const ROLE_PERMISSIONS = {
    [ROLES.USER]: [
        "subscription:create",
        "subscription:read",
        "subscription:update",
        "subscription:delete",
        "reminder:create",
        "reminder:read",
        "reminder:update",
        "reminder:delete",
        "analytics:read",
        "profile:read",
        "profile:update",
    ],
    [ROLES.ADMIN]: [
        "subscription:create",
        "subscription:read",
        "subscription:update",
        "subscription:delete",
        "reminder:create",
        "reminder:read",
        "reminder:update",
        "reminder:delete",
        "analytics:read",
        "profile:read",
        "profile:update",
        "admin:users:read",
        "admin:users:update",
        "admin:users:delete",
        "admin:subscriptions:read",
        "admin:subscriptions:manage",
        "admin:analytics:read",
        "admin:system:manage",
        "admin:categories:manage",
        "admin:services:manage",
    ],
};
exports.ROLE_PERMISSIONS = ROLE_PERMISSIONS;
const PLAN_FEATURES = {
    UNLIMITED_SUBSCRIPTIONS: "unlimitedSubscriptions",
    ADVANCED_CATEGORY_ANALYTICS: "advancedCategoryAnalytics",
    CUSTOM_REMINDERS: "customReminders",
    SMART_SPEND_TRACKING: "smartSpendTracking",
    PRIORITY_SUPPORT: "prioritySupport",
    SMS_REMINDERS: "smsReminders",
    WHATSAPP_REMINDERS: "whatsappReminders",
    AI_WASTE_DETECTION: "aiWasteDetection",
    CSV_EXPORT: "csvExport",
    MULTIPLE_PROFILES: "multipleProfiles",
    EARLY_ACCESS: "earlyAccess",
};
exports.PLAN_FEATURES = PLAN_FEATURES;
// Plan pricing configuration
const PLAN_PRICING = {
    FREE: {
        price: 0,
        currency: "USD",
        interval: "month",
        name: "Free Plan",
    },
    PRO: {
        price: 4.99,
        currency: "USD",
        interval: "month",
        name: "Pro Plan",
    },
    PREMIUM: {
        price: 9.99,
        currency: "USD",
        interval: "month",
        name: "Premium Plan",
    },
};
exports.PLAN_PRICING = PLAN_PRICING;
