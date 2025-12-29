import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Placeholder: aquí enviarías enlaces de pago (email/whatsapp).
  return NextResponse.json({ ok: true, job: "send-payment-link", body });
}

