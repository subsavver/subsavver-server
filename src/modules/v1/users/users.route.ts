import { Request, Response, Router } from "express";
import { auth } from "../../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import UsersController from "./users.controller";
import authenticate from "../../../middlewares/authenticate";
import upload from "../../../middlewares/upload";

const router: Router = Router();

router.get("/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

router.post(
  "/upload-photo",
  authenticate,
  upload.single("file"),
  UsersController.uploadProfileImage
);

export default router;
