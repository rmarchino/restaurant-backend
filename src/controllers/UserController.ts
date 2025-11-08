import { RequestHandler, Response } from "express";
import { UserService } from "../services/UserService";
import logger from "../utils/logger";
import { CreateUserSchema, UpdateUserSchema } from "../dtos/user.dto";
import { changePasswordSchema } from "../lib/zod-schemas";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAllUsers: RequestHandler = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  };

  public getUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(200).json(user);
    } catch (error: any) {
      logger.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  createUser: RequestHandler = async (req, res) => {
    try {
      const parsed = CreateUserSchema.parse(req.body);
      const user = await this.userService.createUser(parsed);
      res.status(201).json(user);
    } catch (error: any) {
      logger.error("Error al crear usuario:", error);
      res.status(400).json({ message: error.message });
    }
  };

  updateUser: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = UpdateUserSchema.parse(req.body);
      const updatedUser = await this.userService.updateUser(id, parsed);
      if (!updatedUser)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      logger.error("Error al actualizar usuario:", error);
      res.status(400).json({ message: error.message });
    }
  };

  deleteUser: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);
      if (!result)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error: any) {
      logger.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  changePassword: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = changePasswordSchema.parse(req.body);

      const result = await this.userService.changePassword(
        id,
        parsed.currentPassword,
        parsed.newPassword
      );

      res.status(200).json(result);
    } catch (error: any) {
      logger.error("Error al cambiar contraseña:", error);
      res.status(400).json({ message: error.message });
    }
  };
}
