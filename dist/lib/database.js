"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../generated/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
require("dotenv/config");
exports.prisma = new client_1.PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
}).$extends((0, extension_accelerate_1.withAccelerate)());
