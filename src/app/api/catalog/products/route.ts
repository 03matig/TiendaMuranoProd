"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs";

export async function GET() {
  try {
    // 🔹 Consulta los productos desde la tabla `stock`
    const { data: products, error } = await supabase.from("stock").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}