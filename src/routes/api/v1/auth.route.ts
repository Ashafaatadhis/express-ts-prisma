import { Router } from "express";
import {
  login,
  handleLogout,
  refreshToken,
} from "../../../controllers/auth.controller";

const router: Router = Router();

router.post("/login", login);
router.post("/logout", handleLogout);
router.post("/refresh-token", refreshToken);

export default router;
