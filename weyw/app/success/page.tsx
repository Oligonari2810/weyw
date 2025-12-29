'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const reservationCode = searchParams.get('reservation')
  const pendingId = searchParams.get('pending')
  const [migrated, setMigrated] = useState(false)

  useEffect(() => {
    // Migrar pending → reservations
    const migrate = async () => {
      const response = await fetch('/api/webhooks/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationCode, pendingId }),
      })
      
      if (response.ok) {
        setMigrated(true)
        // Enviar confirmaciones
        fetch('/api/webhooks/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationCode }),
        })
      }
    }
    
    if (pendingId && !migrated) {
      migrate()
    }
  }, [pendingId, reservationCode, migrated])

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          ¡Pago confirmado!
        </h1>
        <p className="font-mono font-bold text-2xl text-green-600 mb-6">
          {reservationCode}
        </p>
        <p className="text-sm text-gray-600">
          Tienes 45 días para pagar el saldo. Te enviamos los detalles por email y WhatsApp.
        </p>
      </div>
    </main>
  )
}

