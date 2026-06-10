'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import BannerInstitucional from './estudiante/BannerInstitucional';
import LeftColumn from './estudiante/LeftColumn';
import RightColumn from './estudiante/RightColumn';
import EditProfileSidebar from './estudiante/EditProfileSidebar';
import { EstudiantePerfil } from './estudiante/types';
import { useR2Upload } from '@/hooks/useR2Upload';

interface Props {
  userEmail: string | null;
  idLiceo: string | null;
}

export default function DashboardEstudiante({ userEmail, idLiceo: idLiceoProp }: Props) {
  const [perfil, setPerfil] = useState<EstudiantePerfil | null>(null);
  const [idLiceoReal, setIdLiceoReal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { uploadFile, uploading: uploadingPhoto } = useR2Upload({
    folder: 'fotos_perfil',
    maxSizeMB: 2,
    onError: (err) => alert('Error al subir foto: ' + err),
  });

  useEffect(() => {
    if (!userEmail) return;
    const cargarPerfil = async () => {
      setLoading(true);
      try {
        let { data: estudiante, error } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('correo', userEmail.toLowerCase())
          .maybeSingle();

        if (error) throw error;

        let liceoId = estudiante?.id_liceo || null;
        if (!liceoId) {
          const { data: listaData } = await supabase
            .from('lista_blanca')
            .select('id_liceo')
            .eq('correo', userEmail.toLowerCase())
            .maybeSingle();
          liceoId = listaData?.id_liceo || null;
        }
        if (!liceoId) liceoId = idLiceoProp;

        setIdLiceoReal(liceoId);
        setPerfil(estudiante || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, [userEmail, idLiceoProp]);

  const handleSaveProfile = async (updatedData: Partial<EstudiantePerfil>) => {
    if (!perfil) return;
    const { error } = await supabase
      .from('estudiantes')
      .update(updatedData)
      .eq('id', perfil.id);
    if (error) throw new Error(error.message);
    setPerfil({ ...perfil, ...updatedData });
  };

  const handleUploadPhoto = async (file: File) => {
    if (!perfil) return;
    const newPhotoUrl = await uploadFile(file, perfil.foto_url || undefined);
    if (newPhotoUrl) {
      const { error } = await supabase
        .from('estudiantes')
        .update({ foto_url: newPhotoUrl })
        .eq('id', perfil.id);
      if (error) {
        alert('Error al guardar la foto: ' + error.message);
      } else {
        setPerfil({ ...perfil, foto_url: newPhotoUrl });
        alert('¡Foto actualizada correctamente!');
      }
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-500">Cargando perfil...</div>;
  if (!perfil) return <div className="text-center p-10 text-red-500">No se encontró el perfil.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <BannerInstitucional idLiceo={idLiceoReal} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <LeftColumn
            perfil={perfil}
            onEdit={() => setIsEditOpen(true)}
            onUploadPhoto={handleUploadPhoto}
            uploadingPhoto={uploadingPhoto}
          />
        </div>
        <div className="lg:col-span-8">
          <RightColumn perfil={perfil} />
        </div>
      </div>

      <EditProfileSidebar
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        perfil={perfil}
        onSave={handleSaveProfile}
      />
    </div>
  );
}