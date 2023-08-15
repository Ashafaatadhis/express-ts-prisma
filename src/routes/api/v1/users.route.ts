import { Router, Request, Response } from "express";
import passport from "../../../middleware/Auth";

const router: Router = Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.json({ tes: "tes" });
  }
);

router.post("/", (req: Request, res: Response) => {
  res.json({ tes: "tes" });
});

export default router;
