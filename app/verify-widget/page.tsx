"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WebcamCapture from "@/components/WebcamCapture";

function VerifyWidgetInner() {
  const params = useSearchParams();
  const returnUrl = params.get("return_url");

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
      <WebcamCapture onSuccess={handleSuccess} onError={(err) => console.error(err)} />
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
