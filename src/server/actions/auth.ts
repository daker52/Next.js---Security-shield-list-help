"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/db/users";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizeEmail, sanitizeString } from "@/lib/security/sanitize";
import { loginSchema, registerSchema } from "@/server/validations/auth";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function registerAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ip = "register";
  const limited = await rateLimit(ip, "auth-register");
  if (!limited.success) {
    return { success: false, error: "Too many attempts. Try again later." };
  }

  const parsed = registerSchema.safeParse({
    email: sanitizeEmail(formData.get("email")),
    password: formData.get("password"),
    displayName: sanitizeString(formData.get("displayName"), 64),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  await createUser(parsed.data);
  return { success: true, message: "Account created. You can sign in now." };
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const limited = await rateLimit("login", "auth-login");
  if (!limited.success) {
    return { success: false, error: "Too many login attempts. Try again later." };
  }

  const parsed = loginSchema.safeParse({
    email: sanitizeEmail(formData.get("email")),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid email or password" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" };
    }
    throw error;
  }
}
