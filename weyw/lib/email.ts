// MVP: Simulamos con console.log
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`📧 Email enviado a ${to} | Asunto: ${subject}`)
  console.log(`Contenido: ${html}`)
  return { success: true, simulated: true }
}

