// app/components/dashboards/estudiante/BannerInstitucional.tsx
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { School, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiceoInfo {
  nombre: string;
  rbd: string;
  direccion_postal: string;  // ← corregido: antes era direccion
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
      console.log('🔍 Banner → idLiceo:', idLiceo);
      if (!idLiceo) {
        setError('Establecimiento no asignado');
        setLoading(false);
        return;
      }
      try {
        // Seleccionar los campos correctos
        const { data, error } = await supabase
          .from('liceos')
          .select('nombre, rbd, direccion_postal, comuna, logo_url')
          .eq('id', idLiceo)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          console.log('✅ Liceo cargado:', data);
          setLiceo(data);
        } else {
          setError(`No existe liceo con ID ${idLiceo}`);
        }
      } catch (err: any) {
        console.error('Error cargando liceo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargarLiceo();
  }, [idLiceo]);

  if (loading) return <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />;
  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <School size={40} className="mx-auto mb-2 text-amber-500" />
        <p className="text-amber-700">{error}</p>
        <p className="text-xs text-amber-600 mt-2">Contacta al administrador.</p>
      </div>
    );
  }
  if (!liceo) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-[#1a365d] via-[#1e40af] to-[#2563eb] rounded-2xl p-6 text-white shadow-xl overflow-hidden border border-blue-900/50"
    >
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 text-white pointer-events-none">
        <School size={240} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center p-2.5 shadow-inner">
          {liceo.logo_url ? (
            <img src={liceo.logo_url} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <School size={38} className="text-blue-200" />
          )}
        </div>

        <div className="text-center md:text-left flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#f97316] text-white px-2.5 py-0.5 rounded-full shadow-sm">
              Establecimiento Técnico Profesional
            </span>
            {liceo.rbd && (
              <span className="text-xs bg-black/20 backdrop-blur-sm text-blue-200 px-2 py-0.5 rounded-md font-mono">
                RBD: {liceo.rbd}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {liceo.nombre || 'Liceo sin nombre'}
          </h1>
          <p className="text-sm text-blue-100 flex items-center justify-center md:justify-start gap-1.5 font-medium">
            <MapPin size={15} className="text-[#fdba74]" />
            {liceo.direccion_postal ? `${liceo.direccion_postal}, ${liceo.comuna}` : (liceo.comuna || 'Dirección no registrada')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}