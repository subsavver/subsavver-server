import { PaymentStatus } from "../../../generated/prisma";
import { prisma } from "../../../lib/database";
import { CreatePaymentInput } from "./payment.validation";
import dayjs from "../../../lib/dayjs";
import { ConflictError } from "../../../utils/errorHandler";

const getAllPayments = async () => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return payments;
  } catch (error: unknown) {
    console.log("Error getting all payments:", error);
    throw error;
  }
};

const createPayment = async (userId: string, body: CreatePaymentInput) => {
  try {
    const nowPaymentDate = dayjs.utc();

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        subscriptionId: body.subscriptionId,
      },
    });

    if (existingPayment) {
      throw new ConflictError("Payment for this subscription already exists");
    }

    const newPayment = await prisma.payment.create({
      data: {
        userId,
        paidAt: nowPaymentDate.toDate(),
        ...body,
      },
    });

    return newPayment;
  } catch (error: unknown) {
    // console.log("Error creating payment:", error);
    throw error;
  }
};

const getUserPayments = async (userId: string) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
    });

    if (!payments) {
      return null;
    }

    return payments;
  } catch (error: unknown) {
    console.log("Error getting user payments:", error);
    throw error;
  }
};

const getPaymentById = async (paymentId: string) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId },
    });

    return payment;
  } catch (error: unknown) {
    console.log("Error getting payment by ID:", error);
    throw error;
  }
};

const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: status,
        isPaid: status === "SUCCESS",
        paidAt: status === "SUCCESS" ? new Date() : null,
      },
    });

    return updatedPayment;
  } catch (error: unknown) {
    console.log("Error updating payment status:", error);
    throw error;
  }
};

const PaymentService = {
  getAllPayments,
  createPayment,
  getUserPayments,
  getPaymentById,
  updatePaymentStatus,
};

export default PaymentService;
