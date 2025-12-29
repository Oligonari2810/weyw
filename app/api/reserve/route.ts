import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Body inválido (JSON requerido)" },
      { status: 400 }
    );
  }

  const { name, email, date } = body as Partial<{
    name: string;
    email: string;
    date: string;
  }>;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ ok: false, error: "Falta name" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "Falta email" }, { status: 400 });
  }

  if (!date || typeof date !== "string") {
    return NextResponse.json({ ok: false, error: "Falta date" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  // Nota: asumimos columnas comunes: name, email, date.
  // Si tu tabla tiene otros nombres, dímelos y lo ajusto.
  const { data, error } = await supabase
    .from("pending_reservations")
    .insert({ name, email, date })
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, reservation: data });
}

