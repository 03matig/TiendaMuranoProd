"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import supabase from "@/lib/cs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // 🔹 Buscar el usuario por email en la BD
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, pw, role")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // 🔹 Comparar la contraseña ingresada con la almacenada en la BD
    const passwordMatch = await bcrypt.compare(password, user.pw);
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // ✅ Usuario autenticado correctamente
    return NextResponse.json({ 
      message: "Inicio de sesión exitoso", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

// 🔹 Bloquear otros métodos
export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
