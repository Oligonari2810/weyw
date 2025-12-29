import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { createMoneypipePayment } from '@/lib/moneypipe'

export async function POST(request: Request) {
  try {
    const { reservationCode, method, pendingId } = await request.json()
    
    // Obtener datos de pending_reservation
    const { data: pending } = await supabase
      .from('pending_reservations')
      .select('*')
      .eq('id', pendingId)
      .single()

    if (!pending) {
      return NextResponse.json({ error: 'Reserva temporal no encontrada' }, { status: 404 })
    }

    if (method === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Reserva WEYW - ${reservationCode}`,
              },
              unit_amount: 9900,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?reservation=${reservationCode}&pending=${pendingId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pay/${pendingId}`,
        metadata: { reservationCode, pendingId },
      })

      return NextResponse.json({ sessionId: session.id })
    }

    if (method === 'moneypipe') {
      const payment = await createMoneypipePayment(5700, 'DOP')
      return NextResponse.json({ paymentUrl: payment.url })
    }

    return NextResponse.json({ error: 'Método inválido' }, { status: 400 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error procesando pago' }, { status: 500 })
  }
}

