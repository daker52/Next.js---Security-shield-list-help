import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must include upper, lower, and a digit",
    ),
  displayName: z.string().min(1).max(64).trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
