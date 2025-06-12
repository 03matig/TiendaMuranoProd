"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function GET() {
  try {
    // 🔹 Visualizar pedidos singularmente
    const supabase = getSupabase();
    const { data: sponsors, error } = await supabase
      .from("sponsors")
      .select("*")

    if (error) {
      return NextResponse.json({ error: `Error obteniendo productos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ sponsors }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
