"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idCliente = "c93fea07-d717-44dd-9552-d40512cc9a27"; //searchParams.get("id");

    if (!idCliente) {
      return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id_cliente", idCliente);

    if (error) {
      return NextResponse.json({ error: `Error obteniendo pedidos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
