"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs";

export async function POST(req: Request) {
    try {
      const formData = await req.formData();
      const nombre = formData.get("nombre") as string;
      const link_website = formData.get("link_website") as string;
      const descripcion = formData.get("descripcion") as string;
      const user_id = formData.get("user_id") as string;
      const imagen = formData.get("imagen") as File;
      const logo = formData.get("logo") as File;
  
      if (!nombre || !link_website || !imagen || !logo || !user_id) {
        return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
      }
  
      const timestamp = Date.now();
      const nombreArchivoImagen = `sponsors/Activos/${timestamp}-${imagen.name}`;
      const nombreArchivoLogo = `sponsors/Activos/Logo/${timestamp}-${logo.name}`;
  
      // 🔼 Subir imagen principal
      const { error: errorImagen } = await supabase.storage
        .from("sponsors")
        .upload(nombreArchivoImagen, imagen, {
          cacheControl: "3600",
          upsert: true,
          contentType: imagen.type,
        });
  
      if (errorImagen) {
        return NextResponse.json({ error: "Error al subir imagen." }, { status: 500 });
      }
  
      // 🔼 Subir logo
      const { error: errorLogo } = await supabase.storage
        .from("sponsors")
        .upload(nombreArchivoLogo, logo, {
          cacheControl: "3600",
          upsert: true,
          contentType: logo.type,
        });
  
      if (errorLogo) {
        return NextResponse.json({ error: "Error al subir logo." }, { status: 500 });
      }
  
      const urlImagen = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sponsors/${nombreArchivoImagen}`;
      const urlLogo = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sponsors/${nombreArchivoLogo}`;
  
      // 📥 Insertar en la tabla
      const { error: insertError } = await supabase
        .from("sponsors")
        .insert([
          {
            nombre,
            link_website,
            descripcion,
            user_id,
            nombre_archivo_imagen: `/${nombreArchivoImagen}`,
            url_imagen: urlImagen,
            nombre_archivo_logo: `/${nombreArchivoLogo}`,
            url_logo: urlLogo,
            activo: true,
            orden: 0
          }
        ]);
  
      if (insertError) {
        return NextResponse.json({ error: "Error al insertar en la base de datos." }, { status: 500 });
      }
  
      return NextResponse.json({ message: "Sponsor agregado correctamente." }, { status: 200 });
  
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: "Error inesperado." }, { status: 500 });
    }
  }