import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
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

    // Validar lista blanca
    const { data: autorizado, error: listaError } = await supabase
      .from('lista_blanca')
      .select('correo')
      .eq('correo', user.email.toLowerCase())
      .maybeSingle();

    if (!autorizado || listaError) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no-autorizado`);
    }
  }

  // Redirección final al dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}