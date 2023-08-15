import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./users.route";

const router: Router = Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
