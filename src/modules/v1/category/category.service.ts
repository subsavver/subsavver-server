import { prisma } from "../../../lib/database";
import { CreateCategoryInput } from "./category.validation";

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      subscriptionService: {
        select: {
          id: true,
          name: true,
          logo: true,
          company: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

const createCategory = async (data: CreateCategoryInput) => {
  const category = await prisma.category.create({
    data,
  });

  return category;
};

const getCategoryByName = async (name: string) => {
  const category = await prisma.category.findFirst({
    where: {
      name,
    },
  });

  return category;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
    },
  });

  return category;
};

const updateCategory = async (id: string, data: CreateCategoryInput) => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return category;
};

const deleteCategory = async (id: string) => {
  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
  });

  return deletedCategory;
};

const CategoryService = {
  getCategories,
  createCategory,
  getCategoryByName,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
export default CategoryService;
