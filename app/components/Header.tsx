'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          
          {/* Logo - más grande y con redondeo suave */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img 
              src="/Logo_Rectangular.png"  // Asegúrate que el archivo se llama exactamente así
              alt="ConectaTP"
              className="h-12 md:h-14 w-auto object-contain rounded-lg" // logo con esquinas redondeadas
            />
          </Link>

          {/* Botones de navegación (más grandes, redondeados, redirigen a /login) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <NavButton href="/login">Estudiantes</NavButton>
            <NavButton href="/login">Empresas</NavButton>
            <NavButton href="/login">Colegios TP</NavButton>
          </div>

          {/* Botón de inicio de sesión (también redondeado y más grande) */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-2.5 rounded-full text-sm md:text-base transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Menú hamburguesa (para móvil) - opcional, pero lo dejo para que sea responsive */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-[#f97316] focus:outline-none p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable (se puede implementar después) */}
    </nav>
  );
}

// Componente de botón de navegación (estilo outline redondeado, más grande)
function NavButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium text-sm lg:text-base hover:bg-[#f97316] hover:text-white hover:border-[#f97316] transition-all duration-200 shadow-sm"
    >
      {children}
    </Link>
  );
}