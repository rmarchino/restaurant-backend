import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import type { StringValue } from 'ms'
import { redisClient } from "../config/redisClient";

const JWT_SECRET = process.env.JWT_SECRET || "mi_jwt_secreto_muy_seguro";

export class TokenService {
  static async generateToken(
    payload: object,
    expiresIn: number | StringValue = "1h"

  ): Promise<string> {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET as Secret, options);
  }

  static async verifyToken(token: string): Promise<string | JwtPayload> {
    return jwt.verify(token, JWT_SECRET as Secret);
  }

  static async revokeToken(token: string): Promise<void> {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) return;

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await redisClient.set(`bl:${token}`, "revoked", { EX: expiresIn });
    }
  }

  static async isTokenRevoked(token: string): Promise<boolean> {
    const result = await redisClient.get(`bl:${token}`);
    return result === "revoked";
  }
}
