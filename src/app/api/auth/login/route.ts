"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase

const JWT_SECRET = process.env.JWT_SECRET || "murano_super_secreto"; // 🔐 Usa variable de entorno en producción
const JWT_EXPIRES_IN = "2h"; // Puedes ajustar duración del token aquí

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // 🔎 Buscar el usuario por email
    const supabase = getSupabase();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, pw, role")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // 🔐 Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.pw);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // ✅ Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 🎯 Respuesta exitosa con token
    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        token, // Se devuelve al frontend para almacenarlo
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

// 🔒 Bloquear métodos GET
export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
