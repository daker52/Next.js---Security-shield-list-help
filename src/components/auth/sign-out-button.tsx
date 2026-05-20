import { signOut } from "@/lib/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-zinc-400 transition hover:text-red-400"
      >
        Sign out
      </button>
    </form>
  );
}
