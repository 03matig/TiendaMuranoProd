"use server";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getSupabase } from "@/lib/cs";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: NextRequest) {
  try {
    // ✅ Verificar token JWT desde el header
    const authHeader = req.headers.get("authorization") ?? undefined;
    verifyToken(authHeader); // Lanza error si es inválido

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const nombre = formData.get("nombre") as string | null;
    const precioStr = formData.get("precio") as string | null;
    const userId = formData.get("userId") as string | null;
    const desc = formData.get("desc") as string | null;
    const tallasRaw = formData.get("tallas");
    const tallasStr = typeof tallasRaw === "string" ? tallasRaw : "";

    console.log("📌 Recibido en el backend:");
    console.log("Nombre:", nombre);
    console.log("Precio:", precioStr);
    console.log("Archivo:", file ? file.name : "No se recibió archivo");
    console.log("userId:", userId);

    // 🔹 Validaciones
    if (!file || !nombre || !precioStr || !userId) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (file.type !== "image/png") {
      return NextResponse.json({ error: "Solo se permiten imágenes en formato PNG" }, { status: 400 });
    }

    const precio = parseInt(precioStr, 10);
    if (isNaN(precio) || precio <= 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 });
    }

    // 🔹 Verificar si el usuario tiene permisos
    const supabase = getSupabase();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userError || !userData || !["moderator", "admin"].includes(userData.role)) {
      return NextResponse.json({ error: "No tienes permisos para subir imágenes" }, { status: 403 });
    }

    // 🔹 Guardar imagen en `public/images/Productos/Nuevos/`
    const originalFileName = path.parse(file.name).name;
    const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${sanitizedFileName}.png`;
    const filePath = path.join(process.cwd(), "public/images/Productos/Nuevos", fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const relativePath = `Productos/Nuevos/${fileName}`;
    const descValue = desc && desc.trim() !== "" ? desc : null;
    const tallas = tallasStr.trim() !== "" ? JSON.parse(tallasStr) : ["S", "M", "L", "XL"];

    // 🔹 Insertar producto en la base de datos `stock`
    const { data: stockData, error: stockError } = await supabase
      .from("stock")
      .insert([{ 
        nombre, 
        precio, 
        nombre_archivo: relativePath, 
        tallas, 
        desc: descValue 
      }]);

    if (stockError) {
      return NextResponse.json({ error: `Error al guardar en la BD: ${stockError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: "Producto agregado al stock con éxito!", imagePath: relativePath }, { status: 201 });

  } catch (error: any) {
    if (error.message === "Token no enviado") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error.message === "Token inválido o expirado") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("❌ Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
