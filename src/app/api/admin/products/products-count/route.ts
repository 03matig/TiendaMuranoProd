"use server";

import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/cs";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Verificar token desde el header Authorization
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader); // Lanza error si está ausente o inválido

    // ✅ Token válido → ejecutar lógica
    const { count, error } = await supabase
      .from("stock")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { error: `Error obteniendo el conteo: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error en el servidor" },
      { status: 401 }
    );
  }
}
