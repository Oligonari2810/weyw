'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentButtons({ reservationCode, pendingId }: { reservationCode: string, pendingId: string }) {
  const [showMoneypipe, setShowMoneypipe] = useState(false)

  useEffect(() => {
    // Detecta país desde la reserva
    const fetchData = async () => {
      const { data } = await supabase
        .from('pending_reservations')
        .select('user_data ->> origin_country as origin_country')
        .eq('id', pendingId)
        .single()
      
      const country = data?.origin_country
      const caribbean = ['DO', 'HT', 'CU', 'PR', 'JM', 'TT', 'BB', 'GD']
      setShowMoneypipe(caribbean.includes(country))
    }
    fetchData()
  }, [pendingId])

  const handleStripe = async () => {
    const stripe = await stripePromise
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationCode, method: 'stripe', pendingId }),
    })
    const { sessionId } = await response.json()
    await stripe?.redirectToCheckout({ sessionId })
  }

  const handleMoneypipe = async () => {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationCode, method: 'moneypipe', pendingId }),
    })
    const { paymentUrl } = await response.json()
    window.location.href = paymentUrl
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleStripe}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Pagar con Stripe (US$99)
      </button>

      {showMoneypipe && (
        <button
          onClick={handleMoneypipe}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Pagar con Moneypipe (RD$5,700)
        </button>
      )}
    </div>
  )
}

