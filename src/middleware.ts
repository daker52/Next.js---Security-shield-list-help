import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { securityHeaders } from "@/lib/security/headers";
import { rateLimit } from "@/lib/security/rate-limit";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export default auth(async (request) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  if (pathname.startsWith("/api/auth") || authRoutes.includes(pathname)) {
    const limited = await rateLimit(ip, "auth");
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const login = new URL("/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  for (const header of securityHeaders) {
    response.headers.set(header.key, header.value);
  }
  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
