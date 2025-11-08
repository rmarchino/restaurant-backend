import { z } from "zod";
import {
  EmailSchema,
  PasswordSchema,
  BigIntIdSchema,
} from "../lib/zod-schemas";

// Definición del Esquema Zod para Crear un Usuario
export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  rol_id: BigIntIdSchema,
  sede_id: BigIntIdSchema,
  nombre: z.string().max(100).optional(),
  telefono: z.string().max(20).optional(),
  estado: z
    .enum(["ACTIVO", "INACTIVO"])
    .optional()
    .transform((val) => val?.toUpperCase()),
});

// Definición del Esquema Zod para Actualizar un Usuario
export const UpdateUserSchema = CreateUserSchema.partial();

// Tipos de TypeScript generados a partir del esquema Zod
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
