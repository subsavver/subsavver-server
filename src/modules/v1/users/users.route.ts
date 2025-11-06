import { Request, Response, Router } from "express";
import { auth } from "../../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: Router = Router();

router.get("/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

export default router;
