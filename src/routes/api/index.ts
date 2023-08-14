import { Router } from "express";
import users from "./users";
import login from "./login";
import refreshToken from "./refreshToken";

const router: Router = Router();

router.use("/", users);
router.use("/login", login);
router.use("/refresh-token", refreshToken);

export default router;
