"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReservationForm from "@/components/ReservationForm";

type ReserveResponse =
  | { ok: true; reservation: unknown }
  | { ok: false; error: string; code?: string };

export default function HomeClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mt-8">
      <ReservationForm
        onSubmit={async (data) => {
          setSubmitting(true);
          setError(null);
          try {
            const res = await fetch("/api/reserve", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(data),
            });
            const json = (await res.json().catch(() => null)) as ReserveResponse | null;

            if (!json || !("ok" in json) || !json.ok) {
              const msg = json && "error" in json ? json.error : "Error desconocido";
              setError(msg);
              return;
            }

            // MVP: redirige a confirmación con un código simple.
            // Si tu tabla devuelve un `id` real, luego lo conectamos aquí.
            const code = "OK";
            const hash = "demo";
            router.push(`/confirmacion?code=${encodeURIComponent(code)}&hash=${encodeURIComponent(hash)}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Error inesperado");
          } finally {
            setSubmitting(false);
          }
        }}
      />

      {submitting ? <p className="mt-4 text-sm text-gray-600">Enviando…</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">Error: {error}</p> : null}
    </section>
  );
}

