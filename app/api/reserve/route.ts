import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Simulación: Crea reserva temporal
    const reservationCode = "WEYW-" + Date.now()
    
    return NextResponse.json({
      success: true,
      reservation_code: reservationCode,
      payment_hash: "test-" + Date.now()
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Error en reserva' }, { status: 500 })
  }
}
