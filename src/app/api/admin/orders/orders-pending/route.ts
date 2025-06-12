"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // 🔹 Importar configuración de Supabase
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Verificar token desde header Authorization
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader);

    // ✅ Token válido → ejecutar lógica segura
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "Pendiente");

    if (error) {
      return NextResponse.json({ error: `Error obteniendo pedidos pendientes: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 401 });
  }
}
