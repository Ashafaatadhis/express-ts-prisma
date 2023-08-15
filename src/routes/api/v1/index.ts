import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./users.route";
import passport from "../../../middleware/Auth";

const router: Router = Router();
router.use("/auth", authRouter);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRouter
);

export default router;
