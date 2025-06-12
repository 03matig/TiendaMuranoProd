"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // 🔹 Importar configuración de Supabase
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Verificación del token
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader);

    // 🔎 Consulta de pedidos
    const supabase = getSupabase();
    const { data: pedidos, error } = await supabase
      .from("pedidos")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: `Error obteniendo pedidos: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ pedidos }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error en el servidor" },
      { status: 401 }
    );
  }
}
