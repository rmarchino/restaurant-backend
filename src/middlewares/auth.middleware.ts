import { TokenService } from "../services/TokenService";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  rol: string;
  sede_id?: number;
}

// Extendemos Request para incluir la info del usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
    sede_id?: number;
  };
}

// Middleware para verificar el token JWT y validez en Redis
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado. Token no proporcionado." });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET no está definido en las variables de entorno.");
      return res.status(500).json({
        message: "Error interno del servidor. No se pudo verificar el token.",
      });
    }

    // Verificamos si el token fue revocado en Redis
    const isRevoked = await TokenService.isTokenRevoked(token);
    if (isRevoked) {
      return res.status(403).json({
        message: "Token revocado. Por favor inicia sesión nuevamente.",
      });
    }

    // Verificamos la firma y decodificamos el token
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
      sede_id: decoded.sede_id,
    };
    next();
    
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

// Middleware para autorizar acceso basado en roles.
export const autorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRol = req.user?.rol;

    if (!userRol) {
      return res.status(403).json({
        message: "Acceso denegado. No se encontró el rol del usuario.",
      });
    }

    if (!allowedRoles.includes(userRol)) {
      return res.status(403).json({
        message:
          "Acceso denegado. No tienes permisos para realizar esta acción.",
      });
    }
    next();
  };
};

export const authorizeSede = (allowedSedes: number[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userSede = req.user?.sede_id;

    if (!userSede) {
      return res.status(403).json({
        message: "Acceso denegado. No se encontró la sede asociada al usuario.",
      });
    }

    if (!allowedSedes.includes(userSede)) {
      return res.status(403).json({
        message:
          "Acceso denegado. Tu sede no tiene permisos para acceder a este recurso.",
      });
    }

    next();
  };
};
