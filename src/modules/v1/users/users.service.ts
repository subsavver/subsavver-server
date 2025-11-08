import { prisma } from "../../../lib/database";

const findUserById = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user;
  } catch (error: unknown) {
    console.log(error);
  }
};

const updateUser = async (id: string, data: { image: string }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return updatedUser;
  } catch (error: unknown) {
    console.log(error);
  }
};

const UsersService = {
  findUserById,
  updateUser,
};

export default UsersService;
