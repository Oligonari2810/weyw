import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Placeholder: migraciones/ajustes recibidos vía webhook.
  return NextResponse.json({ ok: true, webhook: "migrate", body });
}

