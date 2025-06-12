"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase
import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
