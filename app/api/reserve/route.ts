import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Log para debug (verás en Vercel Functions)
    console.log('⚡ /api/reserve llamado')
    
    // Parsear body
    const body = await request.json()
    console.log('📩 Datos recibidos:', body)
    
    // MOCK: Simular éxito sin tocar Supabase
    const reservationCode = "WEYW-" + Date.now()
    const paymentHash = "hash-" + Date.now()
    
    return NextResponse.json({
      success: true,
      reservation_code: reservationCode,
      payment_hash: paymentHash,
      message: "Reserva simulada (endpoint funciona)"
    })
    
  } catch (error) {
    console.error('❌ Error en /api/reserve:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
