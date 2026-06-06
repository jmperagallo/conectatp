'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Briefcase, GraduationCap, Heart, Globe, Settings, Camera, Video } from 'lucide-react';

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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userEmail) return;
    const cargarOCrearPerfil = async () => {
      setLoading(true);
      // 1. Intentar obtener el perfil de estudiantes
      let { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('correo', userEmail.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No existe el perfil, intentar crearlo desde lista_blanca
        console.log('Perfil no encontrado, creando desde lista_blanca...');
        const { data: listaData, error: listaError } = await supabase
          .from('lista_blanca')
          .select('nombre, apellido_paterno, apellido_materno, especialidad, id_liceo')
          .eq('correo', userEmail.toLowerCase())
          .single();

        if (listaError || !listaData) {
          console.error('Error obteniendo datos de lista_blanca', listaError);
          setPerfil(null);
          setLoading(false);
          return;
        }

        // Crear el perfil en estudiantes
        const nuevoPerfil = {
          correo: userEmail.toLowerCase(),
          nombre: listaData.nombre,
          apellido_paterno: listaData.apellido_paterno,
          apellido_materno: listaData.apellido_materno || '',
          rut: '', // pendiente, lo pediremos después
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

        const { data: newData, error: insertError } = await supabase
          .from('estudiantes')
          .insert(nuevoPerfil)
          .select()
          .single();

        if (insertError) {
          console.error('Error creando perfil de estudiante', insertError);
          setPerfil(null);
        } else {
          setPerfil(newData);
        }
      } else if (error) {
        console.error('Error cargando perfil', error);
        setPerfil(null);
      } else {
        setPerfil(data);
      }
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

  if (!perfil) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">No se pudo cargar o crear tu perfil. Contacta al administrador.</p>
      </div>
    );
  }

  // Calcular progreso (puedes calcularlo según campos llenos, por ahora usamos el campo completitud_perfil)
  const progreso = perfil.completitud_perfil || 0;
  const colorProgreso = progreso < 30 ? '#ef4444' : progreso < 70 ? '#f97316' : '#10b981';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabecera con foto, nombre y barra de progreso */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Foto de perfil */}
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
          {/* Datos básicos */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1a365d]">{perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}</h1>
            <p className="text-gray-600">{perfil.especialidad}</p>
            <p className="text-sm text-gray-500">{perfil.correo} • {perfil.telefono || 'Sin teléfono'}</p>
          </div>
          {/* Barra de progreso */}
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

      {/* Grid de secciones (por ahora solo placeholders) */}
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
            <p className="text-gray-600 text-sm">Próximamente: agregar estudios, cursos, certificaciones.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><Briefcase size={20} /> Experiencia Laboral</h2>
            <p className="text-gray-600 text-sm">Próximamente: prácticas, trabajos, voluntariado.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4">⚙️ Habilidades</h2>
            <p className="text-gray-600 text-sm">Próximamente: lista de habilidades técnicas y blandas.</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2 mb-4"><Heart size={20} /> Intereses y Pasatiempos</h2>
            <p className="text-gray-600 text-sm">Próximamente: lo que te apasiona fuera del estudio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}