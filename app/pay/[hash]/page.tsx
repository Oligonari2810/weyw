'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const paymentHash = params.hash as string
  const reservationCode = searchParams.get('code')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear Checkout Session y redirigir
  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: paymentHash,
          code: reservationCode,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Error al crear sesión de pago')
      }

      // Redirigir al checkout de Stripe
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Completa tu reserva</h1>
          <p className="text-gray-600 mb-8">
            Código: <span className="font-mono font-semibold">{reservationCode || 'N/A'}</span>
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
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando sesión de pago...' : 'Pagar con Stripe (US$99)'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">Error: {error}</p>
              </div>
            )}
            
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
