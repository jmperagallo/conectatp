'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, Briefcase, GraduationCap, Heart, Globe, Camera, 
  Edit3, Mail, Phone, MapPin, Calendar, Award, FileText,
  Code2, Share2, Loader2, AlertCircle, Eye, CheckCircle2,
  Lock, KeyRound, Plus, Trash2
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
  idLiceo: string | null;
}

export default function DashboardEstudiante({ userEmail }: Props) {
  const [perfil, setPerfil] = useState<EstudiantePerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para alternar entre Modo Visualización y Modo Editor Inline
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inicializar cliente Supabase Browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function cargarPerfil() {
      try {
        setLoading(true);
        if (!userEmail) return;

        const { data, error: fetchError } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('correo', userEmail.toLowerCase())
          .single();

        if (fetchError) throw fetchError;
        
        // Mocking de datos de seguridad por si campos vienen vacíos de la DB original
        setPerfil({
          ...data,
          intereses: data.intereses || ['Robótica', 'Desarrollo Web', 'Energías Limpias'],
          pasatiempos: data.pasatiempos || ['🎮 Gaming', '⚽ Fútbol', '🎹 Música'],
          habilidades: data.habilidades || ['JavaScript', 'React', 'Git', 'Resolución de Problemas', 'Trabajo en Equipo'],
          formacion: data.formacion || [
            { institucion: 'Liceo Técnico Industrial', titulo: 'Técnico en Conectividad y Redes', anio_inicio: '2023', anio_fin: '2026' }
          ],
          experiencia_laboral: data.experiencia_laboral || [
            { empresa: 'Entel Chile', cargo: 'Práctica Técnica Soporte TI', anio_inicio: '2025', anio_fin: '2025' }
          ],
          completitud_perfil: data.completitud_perfil || 85
        });
      } catch (err: any) {
        console.error('Error cargando perfil:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPerfil();
  }, [userEmail, supabase]);

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('estudiantes')
        .update({
          nombre: perfil.nombre,
          apellido_paterno: perfil.apellido_paterno,
          apellido_materno: perfil.apellido_materno,
          telefono: perfil.telefono,
          biografia: perfil.biografia,
          linkedin_url: perfil.linkedin_url,
          github_url: perfil.github_url,
          direccion: perfil.direccion,
          fecha_nacimiento: perfil.fecha_nacimiento,
          telefono_emergencia: perfil.telefono_emergencia,
          perfil_publico: perfil.perfil_publico
        })
        .eq('id', perfil.id);

      if (updateError) throw updateError;
      setIsEditing(false);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-height-screen min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#1a365d]" size={42} />
        <p className="text-[#64748b] font-medium tracking-wide animate-pulse">Sincronizando tu espacio ConectaTP...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl border border-red-100 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-[#1a365d] mb-2">Error de Sincronización</h3>
        <p className="text-gray-500 mb-6">{error || 'No se encontró la ficha técnica del estudiante.'}</p>
      </div>
    );
  }

  // Cálculos dinámicos del círculo Duolingo de Completitud
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (perfil.completitud_perfil / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] selection:bg-[#f97316]/20 font-sans pb-16">
      
      {/* HEADER HERO (Glassmorphism & Branding ConectaTP) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a365d] via-[#1e40af] to-[#2563eb] text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Identificación Izquierda */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {perfil.foto_url ? (
                  <img src={perfil.foto_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-white/80" />
                )}
              </div>
              <button className="absolute bottom-1 right-1 bg-[#f97316] text-white p-2 rounded-full shadow-lg hover:bg-[#ea580c] transition-colors duration-200">
                <Camera size={14} />
              </button>
            </div>
            
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight">{perfil.nombre} {perfil.apellido_paterno}</h1>
                <span className="bg-white/20 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                  {perfil.perfil_publico ? '🔓 Visible para Empresas' : '🔒 Privado'}
                </span>
              </div>
              <p className="text-[#f97316] font-bold text-lg tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                <GraduationCap size={20} /> {perfil.especialidad || 'Especialidad No Definida'}
              </p>
              <p className="text-white/70 text-sm flex items-center justify-center sm:justify-start gap-1">
                <MapPin size={14} /> {perfil.direccion || 'Chile'}
              </p>
            </div>
          </div>

          {/* Gamificación Derecha (Progreso Estilo Duolingo & Acciones) */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r={radius} className="text-white/10" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r={radius} className="text-[#f97316] transition-all duration-1000 ease-out" strokeWidth="6" fill="transparent"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black block leading-none">{perfil.completitud_perfil}%</span>
                <span className="text-[9px] text-white/70 font-semibold tracking-wider uppercase">Listo</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/80 max-w-[150px] leading-snug font-medium">¡Tu perfil destaca un 25% más que la media!</p>
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-[#f97316] hover:bg-[#ea580c] text-white shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Ver Perfil' : 'Editar Ficha'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* CUERPO DEL DASHBOARD (Bento Grid Layout) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {isEditing ? (
          /* FORMULARIO DE EDICIÓN INLINE */
          <form onSubmit={handleGuardarPerfil} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1a365d] mb-6 flex items-center gap-2 border-b pb-3">
                <Edit3 className="text-[#f97316]" /> Editor Técnico de Perfil Estudiantil
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nombre</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.nombre} onChange={e => setPerfil({...perfil, nombre: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Apellido Paterno</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.apellido_paterno} onChange={e => setPerfil({...perfil, apellido_paterno: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Apellido Materno</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.apellido_materno} onChange={e => setPerfil({...perfil, apellido_materno: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Teléfono de Contacto</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.telefono} onChange={e => setPerfil({...perfil, telefono: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Fecha de Nacimiento</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.fecha_nacimiento || ''} onChange={e => setPerfil({...perfil, fecha_nacimiento: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Contacto de Emergencia</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.telefono_emergencia || ''} onChange={e => setPerfil({...perfil, telefono_emergencia: e.target.value})} placeholder="Mamá / Papá / Tutor" />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Dirección Particular</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.direccion || ''} onChange={e => setPerfil({...perfil, direccion: e.target.value})} />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Biografía / Presentación Corta (Sobre Mí)</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all resize-none"
                    value={perfil.biografia || ''} onChange={e => setPerfil({...perfil, biografia: e.target.value})} placeholder="Cuéntale a las empresas tus pasiones y metas profesionales..." />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Enlace LinkedIn</label>
                  <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.linkedin_url || ''} onChange={e => setPerfil({...perfil, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Enlace GitHub</label>
                  <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all"
                    value={perfil.github_url || ''} onChange={e => setPerfil({...perfil, github_url: e.target.value})} placeholder="https://github.com/..." />
                </div>
                <div className="flex flex-col justify-end pb-2">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" checked={perfil.perfil_publico} onChange={e => setPerfil({...perfil, perfil_publico: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16a34a]"></div>
                    <span className="ml-3 text-sm font-semibold text-gray-700">Permitir que empresas vean mi perfil</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#f97316] hover:bg-[#ea580c] text-white transition-all shadow-md flex items-center gap-1.5">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* VISTA ASOMBROSA BENTO GRID (Estilo Linear / Duolingo) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMNA IZQUIERDA (Datos, Sobre mí, Redes) */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Tarjeta: Sobre Mí */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-3 tracking-wide">
                  <FileText size={18} className="text-[#f97316]" /> Sobre Mí
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {perfil.biografia || '¡Escribe una breve biografía para captar la atención de reclutadores y profesores en ConectaTP!'}
                </p>
              </div>

              {/* Tarjeta: Datos Personales */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-4 tracking-wide">
                  <User size={18} className="text-[#f97316]" /> Ficha de Identificación
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/70 transition-colors">
                    <Mail size={16} className="text-[#64748b]" />
                    <div className="overflow-hidden truncate"><p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Correo</p><span className="text-gray-700 font-medium text-xs">{perfil.correo}</span></div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/70 transition-colors">
                    <Phone size={16} className="text-[#64748b]" />
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Móvil</p><span className="text-gray-700 font-medium text-xs">{perfil.telefono || 'No registrado'}</span></div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/70 transition-colors">
                    <Calendar size={16} className="text-[#64748b]" />
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Nacimiento</p><span className="text-gray-700 font-medium text-xs">{perfil.fecha_nacimiento || 'No registrado'}</span></div>
                  </div>
                  {perfil.telefono_emergencia && (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
                      <AlertCircle size={16} className="text-[#f97316]" />
                      <div><p className="text-[10px] text-orange-600 font-bold uppercase leading-none">Contacto Emergencia</p><span className="text-gray-700 font-semibold text-xs">{perfil.telefono_emergencia}</span></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarjeta: Conexiones Redes */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-3 tracking-wide">
                  <Globe size={18} className="text-[#f97316]" /> Portafolio & Conexiones
                </h3>
                <div className="flex flex-col gap-2">
                  {perfil.linkedin_url ? (
                    <a href={perfil.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#0a66c2]/5 hover:bg-[#0a66c2]/10 transition-all group">
                      <span className="text-sm font-semibold text-[#0a66c2]">LinkedIn Profesional</span>
                      <Share2 size={16} className="text-[#0a66c2] opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Vincular cuenta de LinkedIn</p>
                  )}
                  {perfil.github_url ? (
                    <a href={perfil.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-black/[0.03] hover:bg-black/[0.07] transition-all group">
                      <span className="text-sm font-semibold text-black flex items-center gap-1.5"><Code2 size={16}/> GitHub Repository</span>
                      <Share2 size={16} className="text-black opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Vincular portafolio de GitHub</p>
                  )}
                </div>
              </div>

            </div>

            {/* COLUMNA CENTRAL Y DERECHA (Timeline Académico/Laboral, Habilidades Bento) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Bento Row: Educación y Prácticas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Bloque: Formación Académica */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
                  <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-4 tracking-wide">
                    <GraduationCap size={20} className="text-[#f97316]" /> Trayectoria Escolar
                  </h3>
                  <div className="relative border-l-2 border-[#1a365d]/10 pl-4 ml-2 space-y-5">
                    {perfil.formacion?.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#1a365d] ring-4 ring-white transition-transform group-hover:scale-125"></div>
                        <h4 className="text-sm font-bold text-[#1a365d] leading-tight">{item.titulo}</h4>
                        <p className="text-xs text-gray-500 font-medium">{item.institucion}</p>
                        <span className="inline-block mt-1 text-[11px] font-bold text-[#f97316] bg-orange-50 px-2 py-0.5 rounded-md">{item.anio_inicio} - {item.anio_fin || 'Progreso'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloque: Experiencia Laboral */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
                  <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-4 tracking-wide">
                    <Briefcase size={20} className="text-[#f97316]" /> Prácticas y Empleos
                  </h3>
                  {perfil.experiencia_laboral?.length ? (
                    <div className="relative border-l-2 border-[#f97316]/20 pl-4 ml-2 space-y-5">
                      {perfil.experiencia_laboral.map((item, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#f97316] ring-4 ring-white transition-transform group-hover:scale-125"></div>
                          <h4 className="text-sm font-bold text-[#1a365d] leading-tight">{item.cargo}</h4>
                          <p className="text-xs text-gray-500 font-medium">{item.empresa}</p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{item.anio_inicio} - {item.anio_fin || 'Actualidad'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <p className="text-xs text-gray-400 italic">Sin registros de prácticas aún.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Bloque Bento: Nube de Habilidades */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
                <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-4 tracking-wide">
                  <Award size={18} className="text-[#f97316]" /> Competencias Técnicas & Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades?.map((hab, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-2 rounded-xl bg-[#1a365d]/5 text-[#1a365d] border border-[#1a365d]/10 hover:bg-[#1a365d] hover:text-white hover:scale-105 transition-all duration-200 cursor-default shadow-sm">
                      ✨ {hab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bloque Bento Ancho: Intereses y Pasatiempos */}
              <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#1a365d] flex items-center gap-1.5 mb-3">
                      <Heart size={16} className="text-[#f97316]" /> Focos de Interés
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {perfil.intereses?.map((int, i) => (
                        <span key={i} className="text-xs font-medium bg-white text-gray-700 px-2.5 py-1.5 rounded-lg border shadow-sm">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a365d] flex items-center gap-1.5 mb-3">
                      🚀 Pasatiempos
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {perfil.pasatiempos?.map((pas, i) => (
                        <span key={i} className="text-xs font-bold bg-orange-50/60 text-[#f97316] px-2.5 py-1.5 rounded-lg border border-orange-100">
                          {pas}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}