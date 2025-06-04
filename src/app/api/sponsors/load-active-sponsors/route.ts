import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // Inicializar cliente de Supabase
  const supabase = createRouteHandlerClient({ cookies });

  // Hacer query a sponsors activos
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('activo', true);

  // Manejo de errores
  if (error) {
    console.error('Error al cargar sponsors activos:', error.message);
    return NextResponse.json({ error: 'Error al cargar sponsors activos' }, { status: 500 });
  }

  // Retornar los datos al frontend
  return NextResponse.json(data);
}
