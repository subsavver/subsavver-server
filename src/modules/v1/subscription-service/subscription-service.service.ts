import { prisma } from "../../../lib/database";
import { CreateSubscriptionData } from "./subscription-service.model";

const getAllServices = async () => {
  try {
    const services = await prisma.subscriptionService.findMany();
    return services;
  } catch (error: unknown) {
    console.log(error);
  }
};

const createService = async (body: CreateSubscriptionData, userId: string) => {
  try {
    const createdService = await prisma.subscriptionService.create({
      data: {
        name: body.name,
        logo: body.logo,
        company: body.company,
        category: body.category,
        createdBy: userId,
      },
    });

    if (!createdService) {
      return null;
    }

    return createdService;
  } catch (error: unknown) {
    console.log(error);
  }
};

// Find service by name
const findByName = async (name: string) => {
  try {
    const service = await prisma.subscriptionService.findFirst({
      where: {
        name,
      },
    });

    return service;
  } catch (error: unknown) {
    console.log(error);
  }
};

// Find service by id
const findById = async (id: string) => {
  try {
    const service = await prisma.subscriptionService.findFirst({
      where: {
        id,
      },
    });

    return service;
  } catch (error: unknown) {
    console.log(error);
  }
};

const updateService = async (id: string, body: CreateSubscriptionData) => {
  try {
    const updatedService = await prisma.subscriptionService.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        logo: body.logo,
        company: body.company,
        category: body.category,
      },
    });

    return updatedService;
  } catch (error: unknown) {
    console.log(error);
  }
};

const deleteServiceById = async (id: string) => {
  try {
    const deletedService = await prisma.subscriptionService.delete({
      where: {
        id,
        users: {
          none: {},
        },
      },
    });

    return deletedService;
  } catch (error: unknown) {
    console.log(error);
  }
};

const SubscriptionService = {
  getAllServices,
  createService,
  findByName,
  findById,
  updateService,
  deleteServiceById,
};

export default SubscriptionService;
