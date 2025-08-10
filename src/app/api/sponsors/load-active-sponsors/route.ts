import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // ✅ Este patrón es correcto
  const supabase = getSupabase();


  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error al cargar sponsors activos:", error.message);
    return NextResponse.json({ error: "Error al cargar sponsors activos" }, { status: 500 });
  }

  return NextResponse.json(data);
}
