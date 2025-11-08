import { z } from "zod";
import { EmailSchema, PasswordSchema } from "../lib/zod-schemas";

export const LoginUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
