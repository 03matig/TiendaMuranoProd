"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs"; // Asegúrate de importar la configuración de Supabase

export async function GET() {
  try {
    // 🔹 Contar el número de productos en la tabla "stock"
    const { count, error } = await supabase
      .from("stock")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: `Error obteniendo el conteo: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
