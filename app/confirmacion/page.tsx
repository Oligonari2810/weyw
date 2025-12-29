import { Suspense } from "react";
import ConfirmacionClient from "./ConfirmacionClient";

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 flex items-center justify-center py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900">Cargando…</h1>
          </div>
        </main>
      }
    >
      <ConfirmacionClient />
    </Suspense>
  );
}

