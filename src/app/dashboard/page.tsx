import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/auth/profile-form";
import { auth } from "@/lib/auth";
import { findUserById } from "@/lib/db/users";
import { getInternalApiKey, redactSecret } from "@/lib/security/secrets";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await findUserById(session.user.id);
  const apiKeyHint = redactSecret(getInternalApiKey());

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16">
      <section>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Protected route — middleware + server-side session check.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-sm font-medium text-zinc-500">Session</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Email</dt>
            <dd className="font-mono text-zinc-200">{session.user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">User ID</dt>
            <dd className="font-mono text-zinc-200">{session.user.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Display name</dt>
            <dd className="font-mono text-zinc-200">
              {user?.displayName ?? session.user.name}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Internal API key</dt>
            <dd className="font-mono text-emerald-400">{apiKeyHint}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Update profile</h2>
        <ProfileForm
          defaultDisplayName={user?.displayName ?? session.user.name ?? ""}
        />
      </section>
    </main>
  );
}
