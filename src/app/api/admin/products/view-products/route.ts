"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // 🔹 Importar configuración de Supabase
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Verificar token desde el header Authorization
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader); // Lanza error si está ausente o inválido
    
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
