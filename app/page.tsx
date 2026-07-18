"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.from("waitlist").insert([{ email: email.trim() }]);
    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("Vous êtes déjà sur la liste !");
      } else {
        setStatus("error");
        setMessage("Une erreur est survenue. Réessayez.");
      }
    } else {
      setStatus("success");
      setMessage("Bienvenue sur la liste d'attente !");
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600" />
            <span className="text-lg font-semibold tracking-tight">Fezlo</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">Connexion</a>
            <a href="/signup" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90">S'inscrire</a>
          </div>
        </div>
      </nav>
      <section className="relative flex flex-col items-center justify-center px-6 pb-24 pt-40">
        <div className="pointer-events-none absolute top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-20 top-40 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Preuve d'humain portable
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Prouvez que vous êtes{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">réel</span>
            , partout.
          </h1>
          <p className="mb-10 text-lg text-zinc-400 leading-relaxed">
            Fezlo atteste votre humanité une seule fois, puis porte cette preuve partout sur le web.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Inscription..." : "Rejoindre la liste"}
            </button>
          </form>
          {status !== "idle" && status !== "loading" && (
            <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>
          )}
        </div>
      </section>
    </main>
  );
}
