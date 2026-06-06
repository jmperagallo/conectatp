import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Definir aquí la URL de origen y la URL de redirección original
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  // Crear cliente de Supabase con cookies
  const cookieStore = await cookies(); // <-- Agregar 'await' aquí
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Intercambiar el código de autorización por una sesión
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Obtener el usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email) {
    // Verificar si el correo está en la lista blanca
    const { data: autorizado, error } = await supabase
      .from('lista_blanca')
      .select('correo')
      .eq('correo', user.email.toLowerCase())
      .maybeSingle();

    if (!autorizado || error) {
      // No autorizado: cerrar sesión y redirigir con error
      await supabase.auth.signOut();
      const origin = requestUrl.origin;
      return NextResponse.redirect(new URL('/login?error=no-autorizado', origin));
    }
  }

  // Redirigir al dashboard si está autorizado
  const origin = requestUrl.origin;
  return NextResponse.redirect(new URL('/dashboard', origin));
}