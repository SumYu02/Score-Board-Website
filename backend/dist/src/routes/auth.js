import { Router } from "express";
import * as authController from "../../controller/auth_controller.js";
const router = Router();
// Register endpoint
router.post("/register", authController.register);
// Login endpoint
router.post("/login", authController.login);
export default router;
//# sourceMappingURL=auth.js.map