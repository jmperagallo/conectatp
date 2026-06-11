import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Si no hay código, redirigir al login (esto faltaba)
  if (!code) {
    console.warn('No se recibió código OAuth');
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  // Obtener el store de cookies (asíncrono)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (err) {
            console.error('Error al establecer cookies:', err);
          }
        },
      },
    }
  );

  // Intercambiar el código por una sesión
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('Error intercambiando código:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`);
  }

  // Obtener el usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.email) {
    console.error('Error obteniendo usuario:', userError);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=user_not_found`);
  }

  // Normalizar correo (trim + minúsculas)
  const emailNormalizado = user.email.toLowerCase().trim();
  console.log(`Validando lista blanca para: ${emailNormalizado}`);

  // Validar lista blanca
  const { data: autorizado, error: listaError } = await supabase
    .from('lista_blanca')
    .select('correo')
    .eq('correo', emailNormalizado)
    .maybeSingle();

  if (!autorizado || listaError) {
    console.error(`Acceso denegado para ${emailNormalizado}: no está en lista_blanca`);
    await supabase.auth.signOut();
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no-autorizado`);
  }

  console.log(`Acceso autorizado para ${emailNormalizado}, redirigiendo a dashboard`);
  // Redirección final al dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}