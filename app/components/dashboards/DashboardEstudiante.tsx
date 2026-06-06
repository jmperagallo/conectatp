// app/components/dashboards/DashboardEstudiante.tsx
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Globe, 
  Camera, 
  Edit3, 
  Linkedin, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award,
  Star,
  TrendingUp,
  CheckCircle,
  Upload,
  Video,
  FileText,
  ExternalLink
} from 'lucide-react';

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
  idLiceo?: string | null; // opcional, no se usa
}

export default function DashboardEstudiante({ userEmail }: Props) {
  const [perfil, setPerfil] = useState<EstudiantePerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userEmail) return;
    const cargarPerfil = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('correo', userEmail.toLowerCase())
        .single();
      if (error) {
        console.error(error);
        setError('No pudimos cargar tu perfil. Intenta más tarde.');
      } else {
        setPerfil(data);
      }
      setLoading(false);
    };
    cargarPerfil();
  }, [userEmail, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
          <p className="text-center text-gray-500 mt-4 animate-pulse">Cargando tu espacio personal...</p>
        </div>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-20">
        <p className="text-red-600 font-medium">❌ {error || 'No se encontró tu perfil'}</p>
        <p className="text-gray-500 text-sm mt-2">Contacta a tu jefe de especialidad para resolverlo.</p>
      </div>
    );
  }

  // Barra de progreso dinámica
  const progreso = perfil.completitud_perfil || 0;
  const colorProgreso = progreso < 30 ? '#ef4444' : progreso < 70 ? '#f97316' : '#10b981';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Tarjeta de perfil principal (hero) */}
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#1a365d] to-[#f97316] opacity-90"></div>
        
        <div className="relative pt-20 pb-8 px-6 md:px-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Avatar con efecto hover */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-full bg-white p-1 shadow-xl">
                {perfil.foto_url ? (
                  <img src={perfil.foto_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a365d] to-[#f97316] flex items-center justify-center">
                    <User size={56} className="text-white" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <Camera size={18} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}
              </h1>
              <p className="text-lg text-[#f97316] font-medium mt-1">{perfil.especialidad}</p>
              <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-gray-500 text-sm">
                <span className="flex items-center gap-1"><Mail size={14} /> {perfil.correo}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {perfil.telefono || 'Sin teléfono'}</span>
              </div>
            </div>
            
            {/* Progreso */}
            <div className="bg-gray-50 rounded-2xl p-4 shadow-inner w-full md:w-64">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Completitud del perfil</span>
                <span>{progreso}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progreso}%`, backgroundColor: colorProgreso }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><TrendingUp size={12} /> Completa más datos para atraer empresas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 2 columnas (contenido principal) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna izquierda - Datos personales + redes */}
        <div className="space-y-6">
          {/* Contacto & Redes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <User size={22} /> Datos Personales
            </h2>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center gap-3"><Calendar size={18} /> {perfil.fecha_nacimiento || 'No indicado'}</p>
              <p className="flex items-center gap-3"><MapPin size={18} /> {perfil.direccion || 'No indicada'}</p>
              <p className="flex items-center gap-3"><Phone size={18} /> 📞 Emergencia: {perfil.telefono_emergencia || 'No indicado'}</p>
            </div>
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Editar datos
            </button>
          </div>

          {/* Redes sociales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <Globe size={22} /> Conecta conmigo
            </h2>
            <div className="space-y-3">
              <a href={perfil.linkedin_url || '#'} className="flex items-center gap-3 text-gray-600 hover:text-[#0077b5] transition">
                <Linkedin size={20} /> LinkedIn {perfil.linkedin_url ? '(ver perfil)' : '(no agregado)'}
              </a>
              <a href={perfil.github_url || '#'} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition">
                <Github size={20} /> GitHub {perfil.github_url ? '(ver perfil)' : '(no agregado)'}
              </a>
            </div>
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Agregar enlaces
            </button>
          </div>
        </div>

        {/* Columna central + derecha (más amplia) - Biografía, formación, experiencia, habilidades */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sobre mí */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-3">
              <FileText size={22} /> Sobre mí
            </h2>
            <p className="text-gray-700 leading-relaxed">{perfil.biografia || 'Escribe una breve descripción sobre ti, tus metas profesionales y lo que te apasiona.'}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {perfil.video_presentacion_url && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Video size={18} /> Video presentación disponible
                </div>
              )}
              <button className="text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
                <Edit3 size={14} /> Editar biografía o video
              </button>
            </div>
          </div>

          {/* Formación académica */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <GraduationCap size={22} /> Formación Académica
            </h2>
            {perfil.formacion && perfil.formacion.length > 0 ? (
              <div className="space-y-3">
                {perfil.formacion.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-[#f97316] pl-4 py-1">
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-sm text-gray-500">{item.institucion} · {item.ano}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No has agregado formación aún.</p>
            )}
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Agregar estudio o curso
            </button>
          </div>

          {/* Experiencia laboral */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <Briefcase size={22} /> Experiencia Laboral
            </h2>
            {perfil.experiencia_laboral && perfil.experiencia_laboral.length > 0 ? (
              <div className="space-y-3">
                {perfil.experiencia_laboral.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-[#f97316] pl-4 py-1">
                    <p className="font-medium">{exp.cargo}</p>
                    <p className="text-sm text-gray-500">{empresa.empresa} · {exp.periodo}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aún no has registrado experiencia laboral.</p>
            )}
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Agregar experiencia
            </button>
          </div>

          {/* Habilidades */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <Award size={22} /> Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {perfil.habilidades && perfil.habilidades.length > 0 ? (
                perfil.habilidades.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star size={14} className="text-[#f97316]" /> {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">Agrega tus habilidades técnicas y blandas.</p>
              )}
            </div>
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Editar habilidades
            </button>
          </div>

          {/* Intereses y pasatiempos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2 mb-4">
              <Heart size={22} /> Intereses y Pasatiempos
            </h2>
            <div className="flex flex-wrap gap-2">
              {perfil.intereses && perfil.intereses.length > 0 ? (
                perfil.intereses.map((interes, idx) => (
                  <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">{interes}</span>
                ))
              ) : (
                <p className="text-gray-500 italic">Comparte tus hobbies e intereses.</p>
              )}
            </div>
            <button className="mt-4 text-sm text-[#f97316] hover:text-[#1a365d] transition flex items-center gap-1">
              <Edit3 size={14} /> Editar intereses
            </button>
          </div>
        </div>
      </div>

      {/* Footer con botón de portafolio público (más adelante) */}
      <div className="text-center pt-8 border-t border-gray-100">
        <button className="bg-gradient-to-r from-[#1a365d] to-[#f97316] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Ver mi portafolio público 🌟
        </button>
        <p className="text-xs text-gray-400 mt-3">Completa tu perfil para que las empresas te encuentren</p>
      </div>

    </div>
  );
}