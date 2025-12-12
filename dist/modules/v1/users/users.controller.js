"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_helper_1 = require("../../../helpers/cloudinary-helper");
const users_service_1 = __importDefault(require("./users.service"));
const uploadProfileImage = async (req, res, next) => {
    try {
        const user = req.user;
        const file = req.file;
        const timestamp = Date.now();
        const userName = user.name.replace(/\s/g, "_").toLowerCase().trim();
        const fileName = `${userName}_${timestamp}`;
        if (!file) {
            throw new Error("No file provided");
        }
        const existingUserProfile = await users_service_1.default.findUserById(user.id);
        if (!existingUserProfile) {
            next(new Error("User not found"));
        }
        if (existingUserProfile?.imagePublicId) {
            await (0, cloudinary_helper_1.deleteImageFromCloudinary)(existingUserProfile?.imagePublicId);
        }
        const uploadedImageResponse = await (0, cloudinary_helper_1.uploadToCloudinary)(file.buffer, fileName);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Profile image uploaded successfully",
            data: {
                image: uploadedImageResponse.secure_url,
                imagePublicId: uploadedImageResponse.public_id,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
const UsersController = {
    uploadProfileImage,
};
exports.default = UsersController;
