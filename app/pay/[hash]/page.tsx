'use client'

import { useSearchParams } from 'next/navigation'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const paymentHash = searchParams.get('hash')
  const reservationCode = searchParams.get('code')

  // URL de pago simple (redirige a Stripe checkout directo)
  const stripePaymentUrl = `https://buy.stripe.com/test_aFadRaf1K7FM4aE9r97Re00`

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Completa tu reserva</h1>
          <p className="text-gray-600 mb-8">
            Código: <span className="font-mono font-semibold">{reservationCode}</span>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2 font-semibold">
              🔗 Depósito requerido: <strong>US$99.00</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Expira en: 24 horas
            </p>
          </div>

          <div className="space-y-4">
            <a 
              href={stripePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition block text-center"
            >
              Pagar con Stripe (US$99)
            </a>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Modo test: Usa tarjeta 4242 4242 4242 4242
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
