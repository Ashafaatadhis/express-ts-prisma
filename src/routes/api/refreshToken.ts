import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { keyJWT } from "../../middleware/Auth";
import prisma from "../../lib/prisma";

const router: Router = Router();
router.get("/", async (req: Request, res: Response) => {
  const token = req.body.token;

  const data = await prisma.refresh_token.findFirst({
    where: {
      refreshToken: token,
    },
    include: {
      user: true,
    },
  });
  if (data && new Date(data.expiredIn).getTime() - new Date().getTime() > 0) {
    const accessToken = jwt.sign(data.user, keyJWT, { expiresIn: "30s" });
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ msg: "Token invalid or Expired" });
  }
});

export default router;
