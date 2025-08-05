import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // ✅ Await necesario para usar cookies correctamente
  const cookieStore = await cookies(); 
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 🔎 Consultar sponsors activos
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('activo', true);

  // ❌ Manejo de errores
  if (error) {
    console.error('Error al cargar sponsors activos:', error.message);
    return NextResponse.json({ error: 'Error al cargar sponsors activos' }, { status: 500 });
  }

  // ✅ Respuesta exitosa
  return NextResponse.json(data);
}
