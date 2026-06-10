'use client';

import { useState, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente separado para el contenido del login (para usar useSearchParams de forma segura)
function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Capturar errores de callback (ej. no autorizado)
  const errorType = searchParams.get('error');
  if (errorType === 'no-autorizado' && !errorMsg) {
    setErrorMsg('⚠️ Tu correo electrónico no está autorizado en la plataforma. Contacta al administrador de tu establecimiento.');
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg('❌ Credenciales incorrectas o usuario no registrado.');
      setLoading(false);
    } else {
      router.refresh();
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg('❌ Hubo un error al conectar con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Columna izquierda: formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <img src="/Logo_Rectangular.png" alt="ConectaTP" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Bienvenido de vuelta</h2>
          <p className="text-center text-gray-500 mt-2 mb-6">Inicia sesión para acceder a tu cuenta</p>

          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition"
                placeholder="ejemplo@liceo.cl"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a365d] hover:bg-[#112440] text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Workspace / Personal</span>
          </button>
        </div>

        {/* Columna derecha: azul con esquinas redondeadas */}
        <div className="hidden md:flex md:w-1/2 bg-[#1a365d] rounded-r-3xl flex-col justify-center items-center p-8 text-white">
          <div className="text-center max-w-sm">
            <h3 className="text-2xl font-bold mb-4">¿Buscas prácticas profesionales?</h3>
            <p className="mb-6">Conecta con las mejores empresas y construye tu futuro profesional.</p>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6">
              <p className="font-semibold">¿Eres una empresa?</p>
              <p className="text-sm mt-1">Publica ofertas de práctica y encuentra talento TP de calidad.</p>
            </div>
            <button className="border border-white hover:bg-white hover:text-[#1a365d] transition px-5 py-2 rounded-full text-sm font-medium">
              Contactar al equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Cargando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}