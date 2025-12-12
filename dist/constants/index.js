"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCIES = exports.PAYMENT_STATUSES = exports.PAYMENT_PROVIDERS = exports.PAGE_LIMIT = exports.REMIND_BEFORE_DAYS = void 0;
exports.REMIND_BEFORE_DAYS = 3; // Default reminder days before renewal date
exports.PAGE_LIMIT = 10;
exports.PAYMENT_PROVIDERS = [
    "STRIPE",
    "PAYPAL",
    "BRAINTREE",
    "ADYEN",
    "TWO_CHECKOUT",
    "WORLDPAY",
    "PAYONEER",
    "APPLE_PAY",
    "GOOGLE_PAY",
    "ALIPAY",
    "WECHAT_PAY",
    "WISE",
];
exports.PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED"];
exports.CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "INR",
    "NZD",
    "SGD",
    "ZAR",
    "HKD",
    "NOK",
    "SEK",
    "DKK",
    "MXN",
    "BRL",
    "RUB",
    "KRW",
    "AED",
    "SAR",
    "BDT",
];
