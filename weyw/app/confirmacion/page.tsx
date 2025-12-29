'use client'

export default function ConfirmacionPage() {
  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">📩</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Reserva recibida!
        </h1>
        <p className="text-gray-600 mb-6">
          En menos de 5 minutos recibirás un WhatsApp y email con tu link de pago único (válido 24h).
        </p>
        <div className="bg-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>¿No lo ves?</strong><br />
            Revisa spam o escríbenos a +1 (809) 555-WEYW
          </p>
        </div>
      </div>
    </main>
  )
}

