import { NextResponse } from "next/server";

export async function POST() {
  // Placeholder: aquí limpiarías reservas/links expirados.
  return NextResponse.json({ ok: true, job: "cleanup-expired" });
}

