'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, Briefcase, GraduationCap, Heart, Globe, Camera, 
  Edit3, Mail, Phone, MapPin, Calendar, Award, FileText,
  Code2, Share2, Loader2, AlertCircle
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
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userEmail) return;
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: err } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('correo', userEmail.toLowerCase())
          .maybeSingle();
        if (err) throw new Error(err.message);
        if (!data) throw new Error('Perfil no encontrado en estudiantes');
        setPerfil(data);
        setEditForm(data);
      } catch (err: any) {
        console.error('Error al cargar perfil:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, [userEmail, supabase]);

  const guardarCambios = async () => {
    if (!perfil) return;
    try {
      const { error: err } = await supabase
        .from('estudiantes')
        .update(editForm)
        .eq('id', perfil.id);
      if (err) throw new Error(err.message);
      setPerfil(editForm);
      setEditando(false);
      alert('Perfil actualizado correctamente');
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-red-700">Error cargando perfil</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <p className="text-xs text-gray-500 mt-4">Contacta al administrador si el problema persiste.</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-md mx-auto">
        <p className="text-yellow-700">No se encontró el perfil de estudiante. Contacta a tu jefe de especialidad.</p>
      </div>
    );
  }

  const progreso = perfil.completitud_perfil || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cabecera principal */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/30 mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/5 to-[#f97316]/5"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#f97316] blur-md opacity-60"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#1a365d] to-[#f97316]">
                  {perfil.foto_url ? (
                    <img src={perfil.foto_url} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <User size={48} />
                    </div>
                  )}
                  <button className="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 shadow-md hover:scale-110 transition">
                    <Camera size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1a365d] to-[#f97316] bg-clip-text text-transparent">
                  {perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}
                </h1>
                <div className="inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20">
                  {perfil.especialidad}
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-100/80 px-3 py-1 rounded-full"><Mail size={14} /> {perfil.correo}</div>
                  {perfil.telefono && <div className="flex items-center gap-1 bg-gray-100/80 px-3 py-1 rounded-full"><Phone size={14} /> {perfil.telefono}</div>}
                  {perfil.direccion && <div className="flex items-center gap-1 bg-gray-100/80 px-3 py-1 rounded-full"><MapPin size={14} /> {perfil.direccion}</div>}
                </div>
              </div>

              {/* Progreso */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                    <circle cx="48" cy="48" r="42" stroke="#f97316" strokeWidth="6" fill="none" 
                      strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - progreso/100)} 
                      strokeLinecap="round" className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#1a365d]">{progreso}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setEditando(!editando)} 
                  className="mt-3 flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#1a365d] text-white text-sm font-medium shadow-md hover:shadow-lg transition"
                >
                  <Edit3 size={14} /> {editando ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {editando ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-[#1a365d] mb-6">Editar perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="text" value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Fecha nacimiento</label><input type="date" value={editForm.fecha_nacimiento || ''} onChange={e => setEditForm({...editForm, fecha_nacimiento: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Teléfono emergencia</label><input type="text" value={editForm.telefono_emergencia || ''} onChange={e => setEditForm({...editForm, telefono_emergencia: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Biografía</label><textarea rows={3} value={editForm.biografia || ''} onChange={e => setEditForm({...editForm, biografia: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input type="url" value={editForm.linkedin_url || ''} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">GitHub</label><input type="url" value={editForm.github_url || ''} onChange={e => setEditForm({...editForm, github_url: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditando(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={guardarCambios} className="px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600">Guardar</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><User size={18} /> Datos personales</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Teléfono:</span> {perfil.telefono || '—'}</p>
                  <p><span className="font-medium">Fecha nac.:</span> {perfil.fecha_nacimiento || '—'}</p>
                  <p><span className="font-medium">Dirección:</span> {perfil.direccion || '—'}</p>
                  <p><span className="font-medium">Tel. emergencia:</span> {perfil.telefono_emergencia || '—'}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><Share2 size={18} /> Redes</h3>
                {perfil.linkedin_url && <a href={perfil.linkedin_url} target="_blank" className="flex items-center gap-2 text-blue-600 text-sm"><Share2 size={14} /> LinkedIn</a>}
                {perfil.github_url && <a href={perfil.github_url} target="_blank" className="flex items-center gap-2 text-gray-800 text-sm mt-1"><Code2 size={14} /> GitHub</a>}
                {!perfil.linkedin_url && !perfil.github_url && <p className="text-gray-400 text-sm">No agregadas</p>}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-2"><FileText size={18} /> Sobre mí</h3>
                <p>{perfil.biografia || 'Sin biografía aún.'}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><GraduationCap size={18} /> Formación</h3>
                {perfil.formacion?.length ? perfil.formacion.map((f, i) => <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2"><p className="font-medium">{f.titulo}</p><p className="text-sm text-gray-500">{f.institucion} • {f.anio}</p></div>) : <p className="text-gray-500">No hay formación</p>}
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><Briefcase size={18} /> Experiencia</h3>
                {perfil.experiencia_laboral?.length ? perfil.experiencia_laboral.map((e, i) => <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2"><p className="font-medium">{e.cargo} en {e.empresa}</p><p className="text-sm text-gray-500">{e.anio_inicio} - {e.anio_fin || 'actual'}</p></div>) : <p className="text-gray-500">Sin experiencia</p>}
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><Award size={18} /> Habilidades</h3>
                <div className="flex flex-wrap gap-2">{perfil.habilidades?.map(h => <span key={h} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{h}</span>)}</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h3 className="font-semibold text-[#1a365d] flex items-center gap-2 mb-3"><Heart size={18} /> Intereses</h3>
                <div className="flex flex-wrap gap-2">
                  {perfil.intereses?.map(i => <span key={i} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm">❤️ {i}</span>)}
                  {perfil.pasatiempos?.map(p => <span key={p} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">🎮 {p}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}