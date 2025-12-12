"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const authenticate_1 = __importDefault(require("../../../middlewares/authenticate"));
const validation_1 = require("../../../middlewares/validation");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.default);
// Get all payments
router.get("/", (0, roleMiddleware_1.authorize)(["ADMIN"]), payment_controller_1.default.getAllPayments);
// Get user's payments
router.get("/user", (0, roleMiddleware_1.authorize)(["USER"]), payment_controller_1.default.getUserPayments);
// Mark as paid payment
router.get("/mark-as-paid", (0, roleMiddleware_1.authorize)(["USER"]), payment_controller_1.default.markAsPaid);
// Get payment details
router.get("/:paymentId", (0, roleMiddleware_1.authorize)(["USER"]), payment_controller_1.default.getPaymentById);
// Create payment
router.post("/", (0, roleMiddleware_1.authorize)(["USER"]), (0, validation_1.validateBody)(payment_validation_1.createPaymentSchema), payment_controller_1.default.createPayment);
// Update payment
router.put("/:paymentId", (0, roleMiddleware_1.authorize)(["USER"]), (0, validation_1.validateBody)(payment_validation_1.updatePaymentSchema), payment_controller_1.default.updatePayment);
// Payment completed
router.post("/complete", (0, roleMiddleware_1.authorize)(["USER"]), payment_controller_1.default.confirmPayment);
exports.default = router;
