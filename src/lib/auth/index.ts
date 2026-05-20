import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { findUserByEmail, verifyPassword } from "@/lib/db/users";
import { sanitizeEmail } from "@/lib/security/sanitize";
import { loginSchema } from "@/server/validations/auth";

function resolveAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;

  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev || isBuild) {
    return "development-only-secret-min-32-chars!";
  }

  throw new Error(
    "AUTH_SECRET must be set in production (min 32 chars). Run: openssl rand -base64 32",
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: resolveAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24h
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: sanitizeEmail(credentials?.email),
          password: credentials?.password,
        });

        if (!parsed.success) return null;

        const user = await findUserByEmail(parsed.data.email);
        if (!user) return null;

        const valid = await verifyPassword(user, parsed.data.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
