"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // 🔹 Importar configuración de Supabase

export async function GET() {
  try {
    const supabase = getSupabase();
    // 🔹 Visualizar pedidos singularmente
    const { data: products, error } = await supabase
      .from("stock")
      .select("*")

    if (error) {
      return NextResponse.json({ error: `Error obteniendo productos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
