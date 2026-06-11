'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { School, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiceoInfo {
  nombre: string;
  rbd: string;
  direccion: string;
  comuna: string;
  logo_url?: string;
}

export default function BannerInstitucional({ idLiceo }: { idLiceo: string | null }) {
  const [liceo, setLiceo] = useState<LiceoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function cargarLiceo() {
      if (!idLiceo) {
        setError('Establecimiento no asignado');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('liceos')
          .select('nombre, rbd, direccion_postal, comuna, logo_url')
          .eq('id', idLiceo)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setLiceo(data);
        } else {
          setError(`No se encontró el establecimiento`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargarLiceo();
  }, [idLiceo]);

  if (loading) return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;
  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <School size={48} className="mx-auto mb-2 text-amber-500" />
        <p className="text-amber-700 font-medium">{error}</p>
        <p className="text-xs text-amber-600 mt-2">Contacta al administrador.</p>
      </div>
    );
  }
  if (!liceo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-[#0b2b4a] via-[#1a365d] to-[#1e4a76] rounded-2xl shadow-xl overflow-hidden border border-[#2d4a72]"
    >
      {/* Patrón de fondo sutil (opcional) */}
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

      {/* Elemento decorativo superior */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#f97316]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        {/* Logo institucional */}
        <div className="shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center p-2 shadow-lg">
            {liceo.logo_url ? (
              <img src={liceo.logo_url} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <School size={48} className="text-white/80" />
            )}
          </div>
        </div>

        {/* Información del establecimiento */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              <Award size={14} /> Establecimiento TP
            </span>
            {liceo.rbd && (
              <span className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-sm text-blue-100 text-xs px-3 py-1 rounded-full font-mono">
                <School size={12} /> RBD: {liceo.rbd}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {liceo.nombre}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-blue-100 text-sm">
            <MapPin size={16} className="text-[#f97316]" />
            <span>
              {liceo.direccion ? `${liceo.direccion}, ${liceo.comuna}` : liceo.comuna || 'Dirección no registrada'}
            </span>
          </div>
        </div>

        {/* Sello o badge de calidad (opcional) */}
        <div className="hidden md:block">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 text-center">
            <p className="text-xs text-blue-200 font-medium">Formación Técnico-Profesional</p>
            <p className="text-[10px] text-blue-300">Prácticas y Empleabilidad</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}