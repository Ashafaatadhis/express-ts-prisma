import { Router } from "express";
import users from "./v1/users.route";
import v1 from "./v1";

const router: Router = Router();

router.use("/v1", v1);

export default router;
