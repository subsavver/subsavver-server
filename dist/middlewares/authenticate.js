"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../lib/auth");
const database_1 = require("../lib/database");
const authenticate = async (req, res, next) => {
    try {
        const session = await auth_1.auth.api.getSession({
            headers: req.headers,
        });
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await database_1.prisma.user.findFirst({
            where: {
                id: session?.user.id,
            },
            include: {
                plan: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (user.banned && new Date(user.banExpires) > new Date()) {
            return res.status(403).json({
                error: `Account suspended. Reason: ${user.banReason}. Expires: ${user.banExpires}`,
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = authenticate;
