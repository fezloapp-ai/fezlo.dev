"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicVerifyPage() {
  const params = useParams();
  const token = params?.token as string;
  const [status, setStatus] = useState<"loading" | "verified" | "not_verified" | "error">("loading");
  const [handle, setHandle] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/verify/" + encodeURIComponent(token))
      .then((res) => res.json())
      .then((data) => {
        setHandle(data.handle || "");
        setStatus(data.verified ? "verified" : "not_verified");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui", textAlign: "center" }}>
      {status === "loading" && <p style={{ color: "#a1a1aa" }}>Chargement...</p>}
      {status === "error" && <p style={{ color: "#f87171" }}>Impossible de vérifier ce profil.</p>}
      {status === "not_verified" && <p style={{ color: "#71717a" }}>Ce profil n'est pas vérifié.</p>}
      {status === "verified" && (
        <>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ color: "white", fontSize: 28 }}>✓</span>
          </div>
          <h1 style={{ color: "white", fontSize: 22, marginBottom: 4 }}>@{handle}</h1>
          <p style={{ color: "#a5b4fc", fontWeight: 600, marginBottom: 24 }}>Vérifié par Fezlo</p>
          <a href="https://fezlo-app.netlify.app" style={{ color: "#6366f1", fontSize: 13 }}>Qu'est-ce que Fezlo ?</a>
        </>
      )}
    </main>
  );
}
