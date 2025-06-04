// app/api/auth/register/set-personal-data/route.ts

import { NextResponse } from "next/server";
import supabase from "@/lib/cs";

export async function POST(req: Request) {
  try {
    console.log("📥 Iniciando POST /set-personal-data");

    const body = await req.json();
    console.log("🔍 Datos recibidos:", body);

    const {
      user_id,
      fullName,
      dob,
      phone_number,
      region,
      ciudad,
      comuna,
      calle,
      numero,
      descripcion,
      codigo_postal
    } = body;

    if (!user_id || !fullName || !dob || !phone_number || !region || !ciudad || !comuna || !calle || !numero || !codigo_postal) {
      console.error("❌ Campos obligatorios faltantes");
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const { data, error } = await supabase.from("delivery").insert([{
      user_id,
      full_name: fullName,
      dob,
      phone_number,
      region,
      ciudad,
      comuna,
      calle,
      numero,
      descripcion: descripcion || null,
      codigo_postal
    }]);

    if (error) {
      console.error("❌ Error al insertar en delivery:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Datos insertados correctamente en delivery:", data);
    return NextResponse.json({ message: "Datos personales registrados correctamente", data }, { status: 201 });

  } catch (err: any) {
    console.error("❌ Error inesperado en el servidor:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
