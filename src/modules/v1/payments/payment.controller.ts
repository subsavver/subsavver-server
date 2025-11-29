import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import PaymentService from "./payment.service";
import { NotFoundError } from "../../../utils/errorHandler";
import { User } from "../../../generated/client";
import config from "../../../config/config";

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
    const page = Number(req.query.page ?? 1) as number;

    const payments = await PaymentService.getUserPayments(userId, page);

    if (!payments) {
      throw new NotFoundError("No payments found for this user");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payments fetched successfully",
      data: payments.data,
      meta: payments.meta,
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

const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = req.query.id as string;

    console.log("payment id", paymentId);

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
      message: "Payment confirm successfully",
      data: updatedPayment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // console.log("Error marking payment as paid:", error);
    next(error);
  }
};

const markAsPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      throw new Error("Token is required");
    }

    const decode = jwt.verify(token, config.jwt_secret) as {
      subId: string;
      userId: string;
    };

    const payment = await PaymentService.getPaymentBySubscriptionId(decode.subId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    const updatedPayment = await PaymentService.updatePaymentStatus(payment.id, "SUCCESS");

    if (!updatedPayment) {
      throw new Error("Failed to update payment status");
    }

    return res.status(200).redirect(`${config.frontendUrl}/dashboard/payments`);
  } catch (error: unknown) {
    // console.log("Error marking payment as paid:", error);
    next(error);
  }
};

const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = req.params.paymentId;
    const body = req.body;

    const payment = await PaymentService.getPaymentById(paymentId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    const updatedPayment = await PaymentService.updatePayment(paymentId, body);

    if (!updatedPayment) {
      throw new Error("Failed to update payment");
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment updated successfully",
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
  markAsPaid,
  confirmPayment,
  updatePayment,
};

export default PaymentController;
