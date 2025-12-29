import WEYWLogo from '@/components/Logo'
import ReservationForm from '@/components/ReservationForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <WEYWLogo />
          <p className="text-xl text-gray-600 mt-4">
            Reserva tu vuelo con US$99. Paga después o activa tu Puente Solidario.
          </p>
        </header>
        
        <div className="max-w-2xl mx-auto">
          <ReservationForm />
        </div>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© 2025 WEYW | Wherever You Want</p>
        </footer>
      </div>
    </main>
  )
}

