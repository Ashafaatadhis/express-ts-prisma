import { Router } from "express";
import { login, refreshToken } from "../../../controllers/auth.controller";

const router: Router = Router();

router.post("/login", login);

router.get("/refresh-token", refreshToken);

export default router;
