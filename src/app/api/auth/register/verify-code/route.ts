// app/api/auth/register/verify-code/route.ts

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function POST(req: Request) {
  try {
    const { email, code, method = "email" } = await req.json();

    if (!email || !code || !["email", "sms"].includes(method)) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // 🔍 Buscar el usuario por correo
    const supabase = getSupabase();
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const user_id = user.id;

    // ✅ Buscar código válido y no expirado
    const { data: codeData, error: codeError } = await supabase
      .from("verification_codes")
      .select("id")
      .eq("user_id", user_id)
      .eq("code", code)
      .eq("method", method)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (codeError || !codeData) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 401 });
    }

    // 🧹 Eliminar el código tras su uso
    await supabase
      .from("verification_codes")
      .delete()
      .eq("id", codeData.id);

    // ✅ Marcar al usuario como verificado
    const { error: updateError } = await supabase
      .from("users")
      .update({ verified: true })
      .eq("id", user_id);

    if (updateError) {
      return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
    }

    return NextResponse.json({ message: "Cuenta verificada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error en verify-code:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
