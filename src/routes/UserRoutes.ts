import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  authenticateToken,
  autorizeRoles,
} from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get(
  "/",
  authenticateToken,
  autorizeRoles(["Administrador"]),
  userController.getAllUsers.bind(userController)
);

export const userRoutes = router;
