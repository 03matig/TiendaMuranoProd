"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs"; // Asegúrate de importar la configuración de Supabase

export async function GET() {
  try {
    // 🔹 Contar el número de pedidos en estado "Pendiente"
    const { count, error } = await supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "Pendiente" || "Procesado" || "En Reparto" || "Entregado");

    if (error) {
      return NextResponse.json({ error: `Error obteniendo pedidos pendientes: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
