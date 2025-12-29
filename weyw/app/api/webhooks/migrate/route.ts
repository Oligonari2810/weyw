import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { reservationCode, pendingId } = await request.json()
    
    // Obtener pending
    const { data: pending } = await supabase
      .from('pending_reservations')
      .select('*')
      .eq('id', pendingId)
      .single()

    if (!pending) {
      return NextResponse.json({ error: 'Reserva temporal no encontrada' }, { status: 404 })
    }

    // Crear usuario real
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        ...pending.user_data,
        bridge_prepared: pending.user_data.bridge_prepared,
      })
      .select()
      .single()

    if (userError) throw userError

    // Crear reserva real
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 45)

    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        reservation_code: reservationCode,
        deposit_paid: true,
        total_estimate: pending.user_data.total_estimate || 680,
        deadline: deadline.toISOString(),
        status: 'active',
      })
      .select()
      .single()

    if (reservationError) throw reservationError

    // Si bridge_prepared === true, vincular bridge_requests
    if (pending.user_data.bridge_prepared) {
      await supabase
        .from('bridge_requests')
        .update({ reservation_id: reservation.id })
        .eq('prepared_at', user.created_at)
    }

    // Eliminar pending
    await supabase.from('pending_reservations').delete().eq('id', pendingId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error migrando reserva' }, { status: 500 })
  }
}

