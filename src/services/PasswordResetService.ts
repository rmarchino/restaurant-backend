import { redisClient } from "../config/redisClient";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { MailerService } from "./MailerService";
import { TokenService } from "./TokenService";

export class PasswordResetService {
  private userRepository = new UserRepository();
  private mailer = new MailerService();

  // Generar token y enviar email
  async sendResetLink(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("No existe un usuario con ese email.");

    const token = await TokenService.generateToken({ id: user.id }, "15m");
    await redisClient.set(`pw-reset:${token}`, user.id.toString(), { EX: 900 });

    const resetUrl = `${process.env.FRONT_URL}/reset-password?token=${token}`;

    const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${user.nombre},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 15 minutos.</p>
    `;

    await this.mailer.sendMail(user.email, "Recupera tu contraseña", html);
  }

  // Verificar token y actualizar contraseña
  async resetPassword(token: string, newPassword: string) {
    const userId = await redisClient.get(`pw-reset:${token}`);
    if (!userId) throw new Error("Token inválido o expirado.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(Number(userId), hashedPassword);

    await redisClient.del(`pw-reset:${token}`);
  }
}
