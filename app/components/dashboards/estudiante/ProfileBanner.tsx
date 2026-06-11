'use client';

import { useRef } from 'react';
import { EstudiantePerfil } from './types';
import { Camera, MapPin, Briefcase } from 'lucide-react';

interface Props {
  perfil: EstudiantePerfil;
  onEdit: () => void;
  onUploadPhoto: (file: File) => Promise<void>;
  uploadingPhoto: boolean;
  onUploadBanner: (file: File) => Promise<void>;
  uploadingBanner: boolean;
}

export default function ProfileBanner({
  perfil,
  onEdit,
  onUploadPhoto,
  uploadingPhoto,
  onUploadBanner,
  uploadingBanner,
}: Props) {
  const fileInputBannerRef = useRef<HTMLInputElement>(null);
  const fileInputPhotoRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadBanner(file);
      if (fileInputBannerRef.current) fileInputBannerRef.current.value = '';
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadPhoto(file);
      if (fileInputPhotoRef.current) fileInputPhotoRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputBannerRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleBannerChange}
        disabled={uploadingBanner}
      />
      <input
        type="file"
        ref={fileInputPhotoRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handlePhotoChange}
        disabled={uploadingPhoto}
      />

      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Banner de fondo */}
        <div className="relative h-32 md:h-40 bg-gradient-to-r from-[#1a365d] to-[#2563eb]">
          {perfil.banner_url && (
            <img src={perfil.banner_url} alt="Banner" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => fileInputBannerRef.current?.click()}
            disabled={uploadingBanner}
            className="absolute bottom-2 right-2 bg-white/80 backdrop-blur rounded-full p-1.5 shadow-md hover:bg-white transition disabled:opacity-50"
            title="Cambiar banner"
          >
            {uploadingBanner ? (
              <div className="w-4 h-4 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={16} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Foto de perfil superpuesta (más grande) */}
        <div className="relative px-6 pb-6">
          <div className="relative -mt-12 flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                {perfil.foto_url ? (
                  <img src={perfil.foto_url} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#f97316] flex items-center justify-center text-white font-bold text-3xl">
                    {perfil.nombre.charAt(0)}{perfil.apellido_paterno.charAt(0)}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputPhotoRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
                title="Cambiar foto"
              >
                {uploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} className="text-gray-600" />
                )}
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                {perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}
              </h1>
              <p className="text-[#f97316] font-medium text-sm">{perfil.especialidad}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                {perfil.direccion && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {perfil.direccion}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase size={14} /> Buscando práctica profesional
                </span>
              </div>
            </div>

            <button
              onClick={onEdit}
              className="mt-2 md:mt-0 px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>
    </>
  );
}