"use server";

import { NextResponse } from "next/server";
import supabase from "@/lib/cs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = "c93fea07-d717-44dd-9552-d40512cc9a27"; //searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Falta el parámetro user_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("delivery")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
