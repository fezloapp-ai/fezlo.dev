"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="text-xl font-semibold tracking-tight text-white">Fezlo</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h1 className="mb-1 text-xl font-bold text-white">Connexion</h1>
          <p className="mb-6 text-sm text-zinc-500">Accédez à votre profil Fezlo.</p>
          <button onClick={handleGoogleLogin} className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10">
            Continuer avec Google
          </button>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" /><span className="text-xs text-zinc-600">ou</span><div className="h-px flex-1 bg-white/10" />
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50" />
            {status === "error" && <p className="text-xs text-rose-400">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {status === "loading" ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-zinc-500">Pas encore de compte ? <a href="/signup" className="text-indigo-400 hover:text-indigo-300">S'inscrire</a></p>
        </div>
      </div>
    </main>
  );
}
