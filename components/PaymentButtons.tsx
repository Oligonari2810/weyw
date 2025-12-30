'use client'

export default function PaymentButtons({ reservationCode, pendingId }: { reservationCode: string, pendingId: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-bold mb-4">✅ Endpoint funciona (en modo test)</p>
        <p className="text-sm text-green-700 mb-4">Para probar el pago real, necesitas Stripe configurado.</p>
      </div>
      
      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
        Stripe no configurado (test mode)
      </button>
    </div>
  )
}
