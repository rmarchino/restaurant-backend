import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middlewares/validate.middleware";
import { CreateUserSchema } from "../dtos/user.dto";
import { LoginUserSchema } from "../dtos/login.dto";
import { authenticateToken } from "../middlewares/auth.middleware";

const authController = new AuthController();
const router = Router();

router.post(
  "/register",
  validate(CreateUserSchema),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validate(LoginUserSchema),
  authController.login.bind(authController)
);

router.post(
  "/logout",
  authenticateToken,
  authController.logout.bind(authController)
);

router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);

router.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);

export const authRoutes = router;
