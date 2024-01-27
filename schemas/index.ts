import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Nova senha é Obrigatório!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Senha é Obrigatório!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Mínimo de 6 Caracteres",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email é Obrigatório",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email é Obrigatório",
  }),
  password: z.string().min(1, {
    message: "Senha é Obrigatório",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Por favor insira um Email válido" }),
    password: z.string().min(6, { message: "Mínimo de 6 Caracteres" }),
    confirmPassword: z.string().min(6, { message: "Mínimo de 6 Caracteres" }),
    name: z.string().min(1, { message: "Por favor insira seu Nome" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });
