import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { id_sponsor, nombre, link_website, orden, descripcion } = body;

    if (!id_sponsor) {
      return NextResponse.json({ error: "Falta el id_sponsor" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { error } = await supabase
      .from("sponsors")
      .update({
        nombre,
        link_website,
        orden,
        descripcion,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id_sponsor", id_sponsor);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Sponsor actualizado correctamente" });
  } catch (err) {
    console.error("Error en update-sponsor:", err);
    return NextResponse.json({ error: "Error inesperado en el servidor" }, { status: 500 });
  }
}
