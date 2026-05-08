import { SpendForm } from "@/components/spend-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-400">
          AISave
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Optimize Your AI Stack
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          See exactly where your team is overspending on AI tools,
          subscriptions, and API usage.
        </p>

        <SpendForm />
      </div>
    </main>
  );
}