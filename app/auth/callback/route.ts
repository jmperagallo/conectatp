import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Obtener el usuario autenticado
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email) {
    // Validar que el correo esté en lista_blanca
    const { data: autorizado, error } = await supabase
      .from('lista_blanca')
      .select('correo')
      .eq('correo', user.email.toLowerCase())
      .maybeSingle();

    if (!autorizado || error) {
      // No autorizado: cerrar sesión y redirigir a login con error
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login?error=no-autorizado', request.url));
    }
  }

  // Redirigir al dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}