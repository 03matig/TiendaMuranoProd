"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs"; // Asegúrate de importar la configuración de Supabase

export async function GET() {
  try {
    // 🔹 Visualizar pedidos singularmente
    const { data: pedidos, error } = await supabase
      .from("pedidos")
      .select("*")

    if (error) {
      return NextResponse.json({ error: `Error obteniendo pedidos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ pedidos }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
