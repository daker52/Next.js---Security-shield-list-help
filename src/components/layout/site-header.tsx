import Link from "next/link";

import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-100">
          <span aria-hidden>🛡️</span>
          <span>Security Shield</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-400">
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-emerald-400">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-emerald-400">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
