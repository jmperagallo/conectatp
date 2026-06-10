// app/components/dashboards/estudiante/LeftColumn.tsx
'use client';

import { useRef } from 'react';
import { EstudiantePerfil } from './types';
import { Mail, Phone, MapPin, Link2, Code2, Download, Edit2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  perfil: EstudiantePerfil;
  onEdit: () => void;
  onUploadPhoto: (file: File) => Promise<void>;
  uploadingPhoto: boolean;
}

export default function LeftColumn({ perfil, onEdit, onUploadPhoto, uploadingPhoto }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadPhoto(file);
    // Limpiar input para permitir subir el mismo archivo nuevamente
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-8 space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        {/* Foto de perfil con botón cámara */}
        <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-4 group">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
            {perfil.foto_url ? (
              <img src={perfil.foto_url} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#f97316] flex items-center justify-center text-white font-bold text-2xl">
                {perfil.nombre.charAt(0)}{perfil.apellido_paterno.charAt(0)}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
            title="Cambiar foto"
          >
            {uploadingPhoto ? (
              <div className="w-4 h-4 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={16} className="text-gray-600" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadingPhoto}
          />
        </div>

        <h1 className="text-xl font-semibold text-slate-900 tracking-tight text-center lg:text-left">
          {perfil.nombre} {perfil.apellido_paterno}
        </h1>
        <p className="text-[#f97316] font-medium text-sm mt-1 text-center lg:text-left">{perfil.especialidad}</p>

        <div className="mt-6 space-y-3 text-slate-600 text-sm">
          <div className="flex items-center gap-3"><Mail size={16} className="text-slate-400 shrink-0" /><span className="truncate">{perfil.correo}</span></div>
          {perfil.telefono && <div className="flex items-center gap-3"><Phone size={16} className="text-slate-400 shrink-0" /><span>{perfil.telefono}</span></div>}
          {perfil.direccion && <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-400 shrink-0" /><span>{perfil.direccion}</span></div>}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
          <button onClick={onEdit} className="w-full py-2.5 px-4 bg-[#1a365d] text-white rounded-lg text-sm font-medium hover:bg-[#112440] transition-colors flex items-center justify-center gap-2">
            <Edit2 size={16} /> Editar Perfil
          </button>
          <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Download size={16} /> Descargar CV
          </button>
        </div>
      </div>

      {(perfil.linkedin_url || perfil.github_url) && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enlaces Profesionales</h2>
          {perfil.linkedin_url && (
            <a href={perfil.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#0077b5] transition-colors">
              <Link2 size={18} /> Perfil Profesional
            </a>
          )}
          {perfil.github_url && (
            <a href={perfil.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 transition-colors">
              <Code2 size={18} /> Portafolio / Código
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}