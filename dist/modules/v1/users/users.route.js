"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../lib/auth");
const node_1 = require("better-auth/node");
const users_controller_1 = __importDefault(require("./users.controller"));
const authenticate_1 = __importDefault(require("../../../middlewares/authenticate"));
const upload_1 = __importDefault(require("../../../middlewares/upload"));
const router = (0, express_1.Router)();
router.get("/me", async (req, res) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    return res.json(session);
});
router.post("/upload-photo", authenticate_1.default, upload_1.default.single("file"), users_controller_1.default.uploadProfileImage);
exports.default = router;
