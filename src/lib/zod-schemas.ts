import { z } from "zod";

// Email: formato válido + sin espacios
export const EmailSchema = z
  .string()
  .trim()
  .email("Formato de email inválido.");

// Password: mínimo 8 caracteres + al menos una letra y un número
export const PasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .regex(/[a-zA-Z]/, "La contraseña debe contener al menos una letra.")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número.");

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Contraseña actual requerida."),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 8 caracteres."),
});

// ID numérico entero positivo
export const BigIntIdSchema = z
  .number()
  .int()
  .positive("El ID debe ser un número entero positivo.");

// Validación de parámetro ID en rutas
export const ParamIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID en el parámetro debe ser un número válido."),
});

// // Paginación
export const PaginationSchema = z
  .object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
  })
  .partial();
