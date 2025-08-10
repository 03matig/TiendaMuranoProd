"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function POST(req: Request) {
  const body = await req.json();
  const { id, recibirCorreos, recibirPromociones, temaOscuro } = body;

  if (!id) {
    return NextResponse.json({ error: "Falta el ID de usuario" }, { status: 400 });
  }
  const supabase = getSupabase();
  const { error } = await supabase
    .from("users")
    .update({
      recibir_correos: recibirCorreos,
      recibir_promociones: recibirPromociones,
      tema_oscuro: temaOscuro,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
