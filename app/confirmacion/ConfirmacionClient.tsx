"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmacionClient() {
  const searchParams = useSearchParams();
  const paymentHash = searchParams.get("hash");
  const reservationCode = searchParams.get("code");

  const payHref = paymentHash ? `/pay/${paymentHash}` : undefined;

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Reserva recibida!</h1>
        <p className="text-gray-600 mb-6">
          Código: <span className="font-mono font-bold">{reservationCode ?? "—"}</span>
        </p>
        <div className="bg-blue-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2 font-semibold">
            🔗 Paga tu depósito ahora (válido 24h):
          </p>
          {payHref ? (
            <a href={payHref} className="text-blue-700 font-bold underline break-all text-sm">
              /pay/{paymentHash}
            </a>
          ) : (
            <p className="text-sm text-blue-800">No se encontró el link de pago.</p>
          )}
        </div>
        <p className="text-xs text-gray-500">
          También te enviaremos este link por WhatsApp y email como recordatorio.
        </p>
      </div>
    </main>
  );
}

