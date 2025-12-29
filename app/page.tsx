import WEYWLogo from "@/components/Logo";
import HomeClient from "./HomeClient";

export default function Page() {
  return (
    <main className="min-h-screen p-6">
      <WEYWLogo />
      <p className="mt-4 text-gray-600">Haz tu reserva para obtener el link de pago.</p>
      <HomeClient />
    </main>
  );
}

