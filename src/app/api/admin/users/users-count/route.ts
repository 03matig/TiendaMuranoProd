"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // ✅ Verificar token del header Authorization
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader); // Lanza error si es inválido o ausente

    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error: any) {
    // Manejo detallado de errores
    if (error.message === "Token no enviado") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error.message === "Token inválido o expirado") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
