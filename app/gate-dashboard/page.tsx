"use client";

import { useState } from "react";

export default function GateDashboardPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<{ company_name: string; monthly_quota: number; calls_used: number } | null>(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    setError("");
    setData(null);
    const res = await fetch("/api/gate/usage?key=" + encodeURIComponent(key.trim()));
    if (!res.ok) {
      setError("Clé invalide.");
      return;
    }
    setData(await res.json());
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", padding: 40, fontFamily: "system-ui", maxWidth: 480, margin: "0 auto" }}>
      <h1>Tableau de bord Fezlo Gate</h1>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Votre clé API"
        style={{ width: "100%", padding: 10, marginTop: 16, borderRadius: 8, border: "1px solid #333", background: "#111", color: "white" }}
      />
      <button onClick={lookup} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 8, background: "#6366f1", color: "white", border: "none" }}>
        Voir mon usage
      </button>
      {error && <p style={{ color: "#f87171", marginTop: 12 }}>{error}</p>}
      {data && (
        <div style={{ marginTop: 24, background: "#111118", padding: 20, borderRadius: 12 }}>
          <p>Client : {data.company_name}</p>
          <p>Utilisées ce mois : {data.calls_used} / {data.monthly_quota}</p>
        </div>
      )}
    </main>
  );
}
