import ReservationForm from '@/components/ReservationForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Los que se fueron… vuelven cuando deciden.
          </h1>
          <p className="text-xl text-gray-600">
            Reserva tu vuelo con US$99. Paga el resto después — o activa tu Puente Solidario.
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

