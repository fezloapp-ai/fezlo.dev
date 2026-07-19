"use client";

import { useEffect } from "react";

export default function WidgetTestPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/widget.js";
    script.setAttribute("data-fezlo-token", "5a079998-537a-4ecd-9ed2-74478b43b853");
    document.getElementById("widget-slot")?.appendChild(script);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", padding: 40, fontFamily: "system-ui" }}>
      <h1>Test du widget Fezlo</h1>
      <p>Voici à quoi ressemble le badge sur un site tiers :</p>
      <div id="widget-slot" style={{ marginTop: 20 }}></div>
    </main>
  );
}
