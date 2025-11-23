import { NextFunction, Request, Response } from "express";
import PaymentService from "./payment.service";
import { NotFoundError } from "../../../utils/errorHandler";
import { User } from "../../../generated/client";

const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await PaymentService.getAllPayments();

    if (!payments) {
      throw new NotFoundError("No payments found");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payments fetched successfully",
      data: payments,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error getting all payments:", error);
    next(error);
  }
};

const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const body = req.body;

    const createdPayment = await PaymentService.createPayment(user.id, body);

    if (!createdPayment) {
      throw new Error("Failed to create payment");
    }

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Payment created successfully",
      data: createdPayment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error creating payment:", error);
    next(error);
  }
};

const getUserPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;

    const payments = await PaymentService.getUserPayments(userId);

    if (!payments) {
      throw new NotFoundError("No payments found for this user");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payments fetched successfully",
      data: payments,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error getting user payments:", error);
    next(error);
  }
};

const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = req.params.paymentId;

    const payment = await PaymentService.getPaymentById(paymentId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment fetched successfully",
      data: payment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error getting payment by ID:", error);
    next(error);
  }
};

const markPaymentAsPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = req.params.paymentId;

    const payment = await PaymentService.getPaymentById(paymentId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    const updatedPayment = await PaymentService.updatePaymentStatus(paymentId, "SUCCESS");

    if (!updatedPayment) {
      throw new Error("Failed to update payment status");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment marked as paid successfully",
      data: updatedPayment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error marking payment as paid:", error);
    next(error);
  }
};

const PaymentController = {
  createPayment,
  getAllPayments,
  getUserPayments,
  getPaymentById,
  markPaymentAsPaid,
};

export default PaymentController;
