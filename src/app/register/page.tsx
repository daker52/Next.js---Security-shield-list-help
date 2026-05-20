import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Strong password rules enforced before hashing with bcrypt (cost 12).
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-zinc-500">
        Already registered?{" "}
        <Link href="/login" className="text-emerald-400 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
