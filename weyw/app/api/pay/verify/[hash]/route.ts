import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  try {
    // Buscar pending reservation
    const { data: pending } = await supabase
      .from('pending_reservations')
      .select('*')
      .eq('id', params.hash)
      .single()

    if (!pending) {
      return NextResponse.json({ valid: false, error: 'Reserva no encontrada' })
    }

    if (new Date(pending.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Enlace expirado' })
    }

    return NextResponse.json({
      valid: true,
      reservation_code: pending.reservation_code,
      id: pending.id,
      expires_at: pending.expires_at,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ valid: false, error: 'Error de verificación' })
  }
}

