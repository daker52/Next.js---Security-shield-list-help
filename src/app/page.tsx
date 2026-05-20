import Link from "next/link";

const features = [
  {
    title: "Security headers",
    desc: "CSP, HSTS, frame denial, Permissions-Policy in next.config + middleware.",
  },
  {
    title: "Auth.js sessions",
    desc: "HTTP-only cookies, JWT strategy, credentials provider with bcrypt.",
  },
  {
    title: "Zod validation",
    desc: "Every Server Action validates input before touching the data layer.",
  },
  {
    title: "Rate limiting",
    desc: "Upstash Redis in production; in-memory fallback for local dev.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-500">
          Next.js App Router · Security by design
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Enterprise Security Shield
        </h1>
        <p className="max-w-xl text-lg text-zinc-400">
          A hardened starting point for Next.js apps — OWASP-minded defaults,
          validated Server Actions, and curated docs in one repo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500"
          >
            Get started
          </Link>
          <Link
            href="https://github.com/daker52/Next.js---Security-shield-list-help"
            className="rounded-lg border border-zinc-700 px-5 py-2.5 font-medium text-zinc-200 hover:border-zinc-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <article
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <h2 className="font-semibold text-emerald-400">{f.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-sm text-amber-100/90">
        <strong className="text-amber-300">Demo store:</strong> users live in
        memory only — replace <code className="text-amber-200">src/lib/db/users.ts</code>{" "}
        with Prisma or Drizzle before production.
      </section>
    </main>
  );
}
