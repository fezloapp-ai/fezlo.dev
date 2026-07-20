"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WebcamCapture from "@/components/WebcamCapture";

const RECAPTCHA_SITE_KEY = "6LdANl0tAAAAADluQPZc1_OumZSh8AFKoN4Qkd2Q";

function VerifyWidgetInner() {
  const params = useSearchParams();
  const returnUrl = params.get("return_url");
  const [gateStatus, setGateStatus] = useState<"checking" | "ok" | "blocked">("checking");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.onload = () => {
      // @ts-ignore
      window.grecaptcha.ready(() => {
        // @ts-ignore
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "verify" })
          .then(async (token: string) => {
            try {
              const res = await fetch("/api/recaptcha-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });
              const data = await res.json();
              setGateStatus(data.success && (data.score ?? 0) >= 0.5 ? "ok" : "blocked");
            } catch {
              setGateStatus("ok");
            }
          })
          .catch(() => setGateStatus("ok"));
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleSuccess = (motionScore: number, verificationId: string) => {
    if (returnUrl) {
      const url = new URL(returnUrl);
      url.searchParams.set("fezlo_verification_id", verificationId);
      window.location.href = url.toString();
    }
  };

  return (
    <div style={{ maxWidth: 480, width: "100%" }}>
      <p style={{ color: "white", textAlign: "center", marginBottom: 16, fontFamily: "system-ui" }}>
        Vérification humaine — Fezlo
      </p>
      {gateStatus === "checking" && <p style={{ color: "#a1a1aa", textAlign: "center" }}>Chargement...</p>}
      {gateStatus === "blocked" && (
        <p style={{ color: "#f87171", textAlign: "center" }}>Vérification refusée. Réessayez plus tard.</p>
      )}
      {gateStatus === "ok" && <WebcamCapture onSuccess={handleSuccess} onError={(err) => console.error(err)} />}
    </div>
  );
}

export default function VerifyWidgetPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Suspense fallback={<p style={{ color: "white" }}>Chargement...</p>}>
        <VerifyWidgetInner />
      </Suspense>
    </main>
  );
}
