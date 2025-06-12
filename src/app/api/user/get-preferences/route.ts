"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("recibir_correos, recibir_promociones, tema_oscuro")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
