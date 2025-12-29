import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Placeholder: confirmación de pago / reserva vía webhook.
  return NextResponse.json({ ok: true, webhook: "confirm", body });
}

