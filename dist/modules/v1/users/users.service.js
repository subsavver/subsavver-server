"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../lib/database");
const findUserById = async (id) => {
    try {
        const user = await database_1.prisma.user.findFirst({
            where: {
                id,
            },
        });
        return user;
    }
    catch (error) {
        console.log(error);
    }
};
const updateUser = async (id, data) => {
    try {
        const updatedUser = await database_1.prisma.user.update({
            where: {
                id,
            },
            data,
        });
        return updatedUser;
    }
    catch (error) {
        console.log(error);
    }
};
const UsersService = {
    findUserById,
    updateUser,
};
exports.default = UsersService;
