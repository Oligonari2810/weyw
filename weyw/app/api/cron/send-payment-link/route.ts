import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'

export async function GET(request: Request) {
  try {
    // Buscar pendientes sin link enviado
    const { data: pendings } = await supabase
      .from('pending_reservations')
      .select('*')
      .eq('status', 'pending_payment_link_sent')
      .lt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 min de buffer

    for (const pending of pendings) {
      const userData = pending.user_data
      const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/pay/${pending.id}`

      const message = `✅ Tu vuelo ${userData.origin_country}–${userData.destination_country} está bloqueado hasta ${new Date(pending.expires_at).toLocaleString()}. 🔗 Paga tu depósito (US$99) ahora para asegurarlo: ${paymentUrl}`

      // Enviar notificaciones
      await Promise.all([
        sendWhatsAppMessage(userData.phone, message),
        sendEmail(userData.email, 'Tu reserva WEYW está confirmada - Paga en 24h', message),
      ])

      // Actualizar status
      await supabase
        .from('pending_reservations')
        .update({ status: 'payment_link_sent' })
        .eq('id', pending.id)
    }

    return NextResponse.json({ success: true, processed: pendings?.length || 0 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error en cron' }, { status: 500 })
  }
}

