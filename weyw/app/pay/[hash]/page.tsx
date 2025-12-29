'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PaymentButtons from '@/components/PaymentButtons'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar hash y obtener datos de pending_reservation
    fetch(`/api/pay/verify/${params.hash}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setData(data)
          setLoading(false)
        } else {
          router.push('/expirado')
        }
      })
  }, [params.hash])

  if (loading) return <div>Verificando enlace...</div>

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Completa tu reserva</h1>
          <p className="text-gray-600 mb-8">
            Código: <span className="font-mono font-semibold">{data.reservation_code}</span>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              💰 Depósito requerido: <strong>US$99.00</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Expira en: {new Date(data.expires_at).toLocaleString()}
            </p>
          </div>

          <PaymentButtons reservationCode={data.reservation_code} pendingId={data.id} />
        </div>
      </div>
    </main>
  )
}

