"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs"; // Asegúrate de importar la configuración de Supabase

export async function GET() {
  try {
    // 🔹 Visualizar pedidos singularmente
    const { data: users, error } = await supabase
      .from("users")
      .select("*")

    if (error) {
      return NextResponse.json({ error: `Error obteniendo productos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
