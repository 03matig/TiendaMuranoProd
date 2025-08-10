import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // 🔎 Buscar usuario por email
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

    // 🔍 Buscar código en la BD
    const { data: codeEntry, error: codeError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", user_id)
      .eq("code", code)
      .eq("method", "email")
      .single();

    if (codeError || !codeEntry) {
      return NextResponse.json({ error: "Código inválido o no encontrado" }, { status: 401 });
    }

    // ⏰ Validar expiración
    const now = new Date();
    const expiresAt = new Date(codeEntry.expires_at);

    if (now > expiresAt) {
      return NextResponse.json({ error: "Código expirado" }, { status: 410 });
    }

    // 🧹 Eliminar el código una vez validado
    await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", user_id)
      .eq("code", code)
      .eq("method", "email");

    return NextResponse.json({ message: "Código válido" }, { status: 200 });

  } catch (error) {
    console.error("🔥 Error al verificar código:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
