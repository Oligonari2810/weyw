// Para MVP: Simulamos envío con console.log
export async function sendWhatsAppMessage(to: string, message: string) {
  console.log(`📱 WhatsApp enviado a ${to}: ${message}`)
  
  // Descomentar para producción con 360dialog:
  /*
  const response = await fetch(`https://waba.360dialog.io/v1/messages`, {
    method: 'POST',
    headers: {
      'D360-API-KEY': process.env.WHATSAPP_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      type: 'template',
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME!,
        language: { code: 'es' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: message }],
          },
        ],
      },
    }),
  })
  return response.json()
  */
  return { success: true, simulated: true }
}

// Mensaje de Puente Solidario
import { calculateBridgeAmountPerContact, getLocalComparison } from './utils'

export async function sendBridgeMessage(
  to: string, 
  travelerName: string, 
  destination: string,
  totalEstimate: number
) {
  const amount = calculateBridgeAmountPerContact(totalEstimate)
  const comparison = getLocalComparison(destination)
  
  const message = `${travelerName} quiere volver a ${destination}. ¿Le das un empujón de US$${amount}? ${comparison}. 0% interés. Se devuelve en 6 meses. ✅ Sí, ayudo / ❌ No, gracias`

  console.log(`📱 WhatsApp Puente a ${to}: ${message}`)
  return { success: true, simulated: true }
}

