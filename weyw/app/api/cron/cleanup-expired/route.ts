import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // Limpiar expiradas
    const { error } = await supabase.rpc('cleanup_expired_reservations')

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error limpiando reservas' }, { status: 500 })
  }
}

