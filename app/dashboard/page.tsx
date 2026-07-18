"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import WebcamCapture from "@/components/WebcamCapture";

interface Profile {
  id: string;
  handle: string | null;
  verified_at: string | null;
  trust_score: number;
  badge_tier: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCapture, setShowCapture] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (error) {
        console.error("Erreur chargement profil:", error);
        setLoading(false);
        return;
      }
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleVerificationSuccess = async () => {
    setVerifying(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !profile) {
      setVerifying(false);
      return;
    }
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ verified_at: now, badge_tier: "verified" })
      .eq("id", session.user.id);
    if (updateError) {
      console.error("Erreur mise à jour profil:", updateError);
      setVerifying(false);
      return;
    }
    const { data: refreshed } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (refreshed) setProfile(refreshed);
    setShowCapture(false);
    setVerifying(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" /></main>;
  }
  if (!profile) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-zinc-400">Impossible de charger votre profil.</main>;
  }

  const isVerified = profile.verified_at !== null;
  const displayHandle = profile.handle ?? "utilisateur";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">Fezlo</span>
          <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-white">Déconnexion</button>
        </div>
      </nav>
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-16">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-2xl font-bold">
            {displayHandle.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">@{displayHandle}</h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">Vérifié</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-500">Non vérifié</span>
            )}
          </div>
        </div>
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4">
              <p className="mb-1 text-xs text-zinc-500">Score de confiance</p>
              <p className="text-3xl font-bold text-indigo-400">{profile.trust_score}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="mb-1 text-xs text-zinc-500">Niveau de badge</p>
              <p className={`text-lg font-semibold ${profile.badge_tier === "verified" ? "text-emerald-400" : "text-zinc-500"}`}>
                {profile.badge_tier === "none" ? "Aucun" : profile.badge_tier}
              </p>
            </div>
          </div>
        </div>
        {!isVerified && !showCapture && (
          <button onClick={() => setShowCapture(true)} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white hover:opacity-90">
            Se vérifier maintenant
          </button>
        )}
        {isVerified && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <p className="text-sm text-emerald-400">✅ Vous êtes vérifié.</p>
          </div>
        )}
        {showCapture && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#111118] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Vérification en direct</h3>
              <button onClick={() => setShowCapture(false)} className="text-xs text-zinc-500 hover:text-white">Annuler</button>
            </div>
            <WebcamCapture onSuccess={handleVerificationSuccess} onError={(err) => console.error("Webcam error:", err)} />
            {verifying && <p className="mt-4 text-center text-sm text-indigo-400">Finalisation...</p>}
          </div>
        )}
      </div>
    </main>
  );
}
