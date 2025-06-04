import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import supabase from "@/lib/cs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // 🔎 Verificar si el email ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // 🔐 Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 Insertar usuario y retornar su ID
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          pw: hashedPassword,
          role: "user",
          name: null,
          verified: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id, email") // 👈 Necesario para devolver el UUID generado
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Usuario creado correctamente", id: data.id, email: data.email }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
