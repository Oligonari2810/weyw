// Genera hash único para link de pago (24h, single-use)
export function generatePaymentHash(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < 16; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

// Genera código de reserva
export function generateReservationCode(): string {
  const date = new Date()
  const yy = date.getFullYear().toString().slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `WEYW-${yy}${mm}${dd}-${random}`
}

// Calcula monto por contacto (fijo US$200 según spec)
export function calculateBridgeAmountPerContact(totalEstimate: number): number {
  return 200; // APROBADO: US$200 fijo por contacto
}

// Frase comparativa por destino (hardcode según tabla)
export function getLocalComparison(destinationCountry: string): string {
  const comparisons: Record<string, string> = {
    'DO': '≈2 comidas en un colmado',
    'ES': '≈un menú del día',
    'SN': '≈3 platos de thieboudienne',
    'PH': '≈4 bowls de adobo',
    'CO': '≈2 bandejas paisa',
    'US': '≈1 cena informal',
    'MX': '≈3 tacos al pastor',
  };
  return comparisons[destinationCountry] || '≈un regalo de bienvenida';
}

// Determina si mostrar Moneypipe
export function getPaymentMethods(country: string) {
  const caribbeanCountries = ['DO', 'HT', 'CU', 'PR', 'JM', 'TT', 'BB', 'GD'];
  const showMoneypipe = caribbeanCountries.includes(country);
  return { showMoneypipe, stripe: true };
}

// Mock de precio de vuelo (conservado)
export function getMockPrice(origin: string, destination: string): number {
  return 680; // Precio fijo para MVP
}

