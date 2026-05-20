"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { type ActionResult } from "@/server/actions/auth";
import { updateProfileAction } from "@/server/actions/profile";

type ProfileFormProps = {
  defaultDisplayName: string;
};

const initial: ActionResult | null = null;

export function ProfileForm({ defaultDisplayName }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initial,
  );

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
          defaultValue={defaultDisplayName}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-600 px-4 py-2.5 font-medium text-zinc-100 transition hover:border-emerald-500 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update profile"}
      </button>
    </form>
  );
}
