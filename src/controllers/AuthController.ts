import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../services/AuthService";
import { TokenService } from "../services/TokenService";
import { PasswordResetService } from "../services/PasswordResetService";

export class AuthController {
  private authService = new AuthService();
  private passwordService = new PasswordResetService();

  constructor() {
    this.authService = new AuthService();
    this.passwordService = new PasswordResetService();
  }

  public register: RequestHandler = async (req, res) => {
    try {
      const { user, token } = await this.authService.register(req.body);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Error al registrar el usuario",
      });
    }
  };

  public login: RequestHandler = async(req, res) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      console.error("Error al iniciar sesión:", error);
      res
        .status(500)
        .json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  public logout: RequestHandler = async(req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return res.status(400).json({ message: "Token no proporcionado." });
      }

      await TokenService.revokeToken(token);
      return res.status(200).json({ message: "Sesión cerrada correctamente." });
    } catch (error) {
      console.error("Error en logout:", error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  }

  public forgotPassword: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;
      await this.passwordService.sendResetLink(email);

      return res.json({
        message:
          "Se ha enviado un enlace de recuperación al correo proporcionado.",
      });
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  public resetPassword: RequestHandler = async(req, res) => {
    try {
      const { token, password } = req.body;
      await this.passwordService.resetPassword(token, password);
      return res.json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
      console.error("Error en resetPassword:", error);
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}
