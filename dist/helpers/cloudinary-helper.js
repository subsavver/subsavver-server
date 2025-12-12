"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: "subsavver/profile_images",
            public_id: fileName,
            overwrite: true,
            invalidate: true,
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.default.uploader.destroy(publicId);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
