import WEYWLogo from '@/components/Logo'
import HomeClient from './HomeClient'

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <header className="text-center mb-12">
        <WEYWLogo />
        <p className="text-xl text-gray-600 mt-4">
          Reserva tu vuelo con US$99. Paga después o activa tu Puente Solidario.
        </p>
      </header>
      <HomeClient />
    </main>
  )
}

