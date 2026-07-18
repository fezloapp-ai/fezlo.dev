"use client";

import Script from "next/script";

export default function WidgetTestPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", padding: 40, fontFamily: "system-ui" }}>
      <h1>Test du widget Fezlo</h1>
      <p>Voici à quoi ressemble le badge sur un site tiers :</p>
      <div style={{ marginTop: 20 }}>
        <Script src="/widget.js" data-fezlo-handle="gettruvem" strategy="afterInteractive" />
      </div>
    </main>
  );
}
