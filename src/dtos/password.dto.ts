import z from "zod";
import { EmailSchema, PasswordSchema } from "../lib/zod-schemas";

export const ForgotPasswordDto = z.object({
  email: EmailSchema,
});

export const ResetPasswordDto = z.object({
  token: z.string().min(6),
  password: PasswordSchema,
});

export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;
export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;
