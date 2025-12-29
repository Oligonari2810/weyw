import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { reservationCode } = await request.json()
    
    // Actualiza reserva
    await supabase
      .from('reservations')
      .update({ deposit_paid: true, status: 'active' })
      .eq('reservation_code', reservationCode)

    // Obtiene datos del usuario
    const { data: reservation } = await supabase
      .from('reservations')
      .select('*, user_id (*)')
      .eq('reservation_code', reservationCode)
      .single()

    const user = reservation.user_id as any

    // Mensaje de confirmación
    const message = `✅ ¡Listo! Tu lugar está reservado. Tienes 45 días para pagar el saldo: US$${reservation.total_estimate - reservation.deposit_amount}. Cronómetro activado. Código: ${reservationCode}`

    // Enviar notificaciones
    await Promise.all([
      sendWhatsAppMessage(user.phone, message),
      sendEmail(user.email, 'Reserva WEYW Confirmada', message),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error confirmando pago' }, { status: 500 })
  }
}

