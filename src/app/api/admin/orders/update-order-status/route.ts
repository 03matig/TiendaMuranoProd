import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/cs";

// Lista blanca de estados válidos según la restricción CHECK
const ESTADOS_VALIDOS = ["Pendiente", "Procesado", "En Reparto", "Entregado"];

export async function POST(req: NextRequest) {
  try {
    const { id_pedido, nuevo_estado } = await req.json();

    if (!id_pedido || !nuevo_estado) {
      return NextResponse.json(
        { error: "Faltan parámetros: id_pedido y nuevo_estado son requeridos." },
        { status: 400 }
      );
    }

    if (!ESTADOS_VALIDOS.includes(nuevo_estado)) {
      return NextResponse.json(
        { error: `Estado inválido: '${nuevo_estado}' no es un valor permitido.` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pedidos")
      .update({ estado: nuevo_estado })
      .eq("id_pedido", id_pedido);

    if (error) {
      return NextResponse.json(
        { error: `Error actualizando pedido: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Estado del pedido actualizado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error del servidor al procesar la solicitud." },
      { status: 500 }
    );
  }
}