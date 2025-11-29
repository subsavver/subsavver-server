import { Router } from "express";
import PaymentController from "./payment.controller";
import { authorize } from "../../../middlewares/roleMiddleware";
import authenticate from "../../../middlewares/authenticate";
import { validateBody } from "../../../middlewares/validation";
import { createPaymentSchema, updatePaymentSchema } from "./payment.validation";

const router = Router();

router.use(authenticate);

// Get all payments
router.get("/", authorize(["ADMIN"]), PaymentController.getAllPayments);

// Get user's payments
router.get("/user", authorize(["USER"]), PaymentController.getUserPayments);

// Mark as paid payment
router.get("/mark-as-paid", authorize(["USER"]), PaymentController.markAsPaid);

// Get payment details
router.get("/:paymentId", authorize(["USER"]), PaymentController.getPaymentById);

// Create payment
router.post(
  "/",
  authorize(["USER"]),
  validateBody(createPaymentSchema),
  PaymentController.createPayment
);

// Update payment
router.put(
  "/:paymentId",
  authorize(["USER"]),
  validateBody(updatePaymentSchema),
  PaymentController.updatePayment
);

// Payment completed
router.post("/complete", authorize(["USER"]), PaymentController.confirmPayment);

export default router;
