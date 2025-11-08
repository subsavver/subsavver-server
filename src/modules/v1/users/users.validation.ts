import * as z from "zod";

export const uploadProfileImageSchema = z.object({
  files: z.instanceof(File, { message: "File is required" }),
});

export type UploadProfileImageInput = z.infer<typeof uploadProfileImageSchema>;
