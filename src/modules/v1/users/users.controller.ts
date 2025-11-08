import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloudinary, uploadToCloudinary } from "../../../helpers/cloudinary-helper";
import { User } from "../../../generated/prisma";
import UsersService from "./users.service";

const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const file = req.file as Express.Multer.File;
    const timestamp = Date.now();
    const userName = user.name.replace(/\s/g, "_").toLowerCase().trim();
    const fileName = `${userName}_${timestamp}`;

    if (!file) {
      throw new Error("No file provided");
    }

    const existingUserProfile = await UsersService.findUserById(user.id);

    if (!existingUserProfile) {
      next(new Error("User not found"));
    }

    if (existingUserProfile?.imagePublicId) {
      await deleteImageFromCloudinary(existingUserProfile?.imagePublicId);
    }

    const uploadedImageResponse = await uploadToCloudinary(file.buffer, fileName);

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
  } catch (error: unknown) {
    next(error);
  }
};

const UsersController = {
  uploadProfileImage,
};

export default UsersController;
