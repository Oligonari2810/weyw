export async function createMoneypipePayment(amount: number, currency: string) {
  const response = await fetch('https://api.moneypipe.io/v1/payment_links', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MONEYPIPE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      description: 'Reserva WEYW - Depósito',
    }),
  })
  return response.json()
}

