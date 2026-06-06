'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Briefcase, GraduationCap, Heart, Globe, Camera } from 'lucide-react';

interface EstudiantePerfil {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  correo: string;
  telefono: string;
  especialidad: string;
  foto_url: string | null;
  video_presentacion_url: string | null;
  biografia: string | null;
  intereses: string[];
  pasatiempos: string[];
  formacion: any[];
  experiencia_laboral: any[];
  habilidades: string[];
  linkedin_url: string | null;
  github_url: string | null;
  fecha_nacimiento: string | null;
  telefono_emergencia: string | null;
  direccion: string | null;
  perfil_publico: boolean;
  completitud_perfil: number;
}

interface Props {
  userEmail: string | null;
  idLiceo: string | null;
}

export default function DashboardEstudiante({ userEmail, idLiceo }: Props) {
  const [perfil, setPerfil] = useState<EstudiantePerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDetallado, setErrorDetallado] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userEmail) return;
    const cargarOCrearPerfil = async () => {
      setLoading(true);
      setErrorDetallado(null);
      const correoNormalizado = userEmail.toLowerCase().trim();
      console.log('🔍 Buscando/creando perfil para:', correoNormalizado);

      // 1. Intentar obtener el perfil de estudiantes
      let { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('correo', correoNormalizado)
        .maybeSingle(); // usar maybeSingle para evitar error si no existe

      if (error) {
        console.error('Error al consultar estudiantes:', error);
        setErrorDetallado(`Error en consulta: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ Perfil encontrado en estudiantes');
        setPerfil(data);
        setLoading(false);
        return;
      }

      // 2. No existe, intentar crear desde lista_blanca
      console.log('📝 Perfil no encontrado, creando desde lista_blanca...');
      const { data: listaData, error: listaError } = await supabase
        .from('lista_blanca')
        .select('nombre, apellido_paterno, apellido_materno, especialidad, id_liceo')
        .eq('correo', correoNormalizado)
        .maybeSingle();

      if (listaError) {
        console.error('Error consultando lista_blanca:', listaError);
        setErrorDetallado(`Error en lista_blanca: ${listaError.message}`);
        setLoading(false);
        return;
      }

      if (!listaData) {
        console.error('❌ Estudiante no encontrado en lista_blanca');
        setErrorDetallado('No estás registrado como estudiante en la plataforma. Contacta a tu jefe de especialidad.');
        setLoading(false);
        return;
      }

      if (!listaData.id_liceo) {
        console.error('❌ El registro en lista_blanca no tiene id_liceo');
        setErrorDetallado('Tu cuenta no está vinculada a una institución. Contacta al administrador.');
        setLoading(false);
        return;
      }

      // Preparar nuevo perfil
      const nuevoPerfil = {
        correo: correoNormalizado,
        nombre: listaData.nombre,
        apellido_paterno: listaData.apellido_paterno,
        apellido_materno: listaData.apellido_materno || '',
        rut: '0', // temporal, luego se pedirá
        telefono: '',
        especialidad: listaData.especialidad,
        id_liceo: listaData.id_liceo,
        foto_url: null,
        video_presentacion_url: null,
        biografia: null,
        intereses: [],
        pasatiempos: [],
        formacion: [],
        experiencia_laboral: [],
        habilidades: [],
        linkedin_url: null,
        github_url: null,
        fecha_nacimiento: null,
        telefono_emergencia: null,
        direccion: null,
        perfil_publico: false,
        completitud_perfil: 0
      };

      console.log('📤 Insertando en estudiantes:', nuevoPerfil);
      const { data: newData, error: insertError } = await supabase
        .from('estudiantes')
        .insert(nuevoPerfil)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error al insertar en estudiantes:', insertError);
        setErrorDetallado(`Error al crear perfil: ${insertError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Perfil creado exitosamente');
      setPerfil(newData);
      setLoading(false);
    };
    cargarOCrearPerfil();
  }, [userEmail, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a365d] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorDetallado || !perfil) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-2">No se pudo cargar o crear tu perfil.</p>
        {errorDetallado && <p className="text-sm text-red-500">Motivo: {errorDetallado}</p>}
        <p className="text-xs text-gray-500 mt-4">Contacta al administrador si el problema persiste.</p>
      </div>
    );
  }

  const progreso = perfil.completitud_perfil || 0;
  const colorProgreso = progreso < 30 ? '#ef4444' : progreso < 70 ? '#f97316' : '#10b981';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabecera */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative">
            {perfil.foto_url ? (
              <img src={perfil.foto_url} alt="Foto" className="w-28 h-28 rounded-full object-cover border-4 border-[#f97316]" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1a365d] to-[#f97316] flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200">
              <Camera size={16} className="text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1a365d]">{perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}</h1>
            <p className="text-gray-600">{perfil.especialidad}</p>
            <p className="text-sm text-gray-500">{perfil.correo} • {perfil.telefono || 'Sin teléfono'}</p>
          </div>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Completitud del perfil</span>
              <span>{progreso}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progreso}%`, backgroundColor: colorProgreso }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Completa tu perfil para que las empresas te vean</p>
          </div>
        </div>
      </div>

      {/* Grid de secciones (placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><User size={20} /> Datos Personales</h2>
            <p className="text-gray-600 text-sm">Próximamente: fecha de nacimiento, dirección, teléfono de emergencia.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><Globe size={20} /> Redes y Enlaces</h2>
            <p className="text-gray-600 text-sm">Próximamente: LinkedIn, GitHub, portafolio.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><User size={20} /> Sobre mí</h2>
            <p className="text-gray-600 text-sm">Próximamente: biografía, video de presentación.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><GraduationCap size={20} /> Formación Académica</h2>
            <p className="text-gray-600 text-sm">Próximamente: estudios, cursos, certificaciones.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><Briefcase size={20} /> Experiencia Laboral</h2>
            <p className="text-gray-600 text-sm">Próximamente: prácticas, trabajos, voluntariado.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4">⚙️ Habilidades</h2>
            <p className="text-gray-600 text-sm">Próximamente: habilidades técnicas y blandas.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><Heart size={20} /> Intereses y Pasatiempos</h2>
            <p className="text-gray-600 text-sm">Próximamente: lo que te apasiona.</p>
          </div>
        </div>
      </div>
    </div>
  );
}