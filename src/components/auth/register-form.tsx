"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import {
  registerAction,
  type ActionResult,
} from "@/server/actions/auth";

const initial: ActionResult | null = null;

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initial);

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
      {state && !state.success && (
        <Alert variant="error">{state.error}</Alert>
      )}
      {state?.success && state.message && (
        <Alert variant="success">{state.message}</Alert>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-zinc-400">Display name</span>
        <input
          name="displayName"
          type="text"
          required
          maxLength={64}
          autoComplete="name"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-zinc-400">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-zinc-400">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
        <span className="text-xs text-zinc-500">
          Min 8 chars, upper + lower + digit
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
