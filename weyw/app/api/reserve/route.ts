import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReservationCode, generatePaymentHash, getMockPrice } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Generar códigos
    const reservationCode = generateReservationCode()
    const paymentHash = generatePaymentHash()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24h exactas

    // Calcular estimado
    const totalEstimate = getMockPrice(body.origin_country, body.destination_country)

    // Crear pending_reservation
    const { error } = await supabase
      .from('pending_reservations')
      .insert({
        user_data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          origin_country: body.origin_country,
          destination_country: body.destination_country,
          travel_date: body.travel_date,
          bridge_prepared: body.bridge_prepared,
          total_estimate: totalEstimate,
        },
        reservation_code: reservationCode,
        expires_at: expiresAt.toISOString(),
      })

    if (error) throw error

    // SI bridge_prepared === true, crear bridge_requests preparado
    if (body.bridge_prepared) {
      await supabase.from('bridge_requests').insert({
        reservation_id: null, // se vinculará después
        status: 'prepared',
        contact_slots: JSON.stringify([null, null, null]),
        prepared_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      reservation_code: reservationCode,
      payment_hash: paymentHash,
      expires_at: expiresAt,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Error al crear reserva temporal' }, { status: 500 })
  }
}

