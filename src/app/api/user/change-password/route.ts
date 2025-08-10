"use server";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
