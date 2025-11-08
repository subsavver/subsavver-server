import cloudinary from "../lib/cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer: Buffer, fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "subsavver/profile_images",
        public_id: fileName,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const deleteImageFromCloudinary = async (publicId: string | null) => {
  try {
    await cloudinary.uploader.destroy(publicId!);
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};

export { uploadToCloudinary, deleteImageFromCloudinary };
