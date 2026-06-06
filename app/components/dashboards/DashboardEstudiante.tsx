'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, Briefcase, GraduationCap, Heart, Globe, Camera, 
  Edit3, Code, Share2, Mail, Phone, MapPin, Calendar, 
  Award, FileText, CheckCircle, Loader2 
} from 'lucide-react';

interface EstudiantePerfil {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
  especialidad: string;
  foto_url: string | null;
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
  completitud_perfil: number;
}

export default function DashboardEstudiante({ userEmail }: { userEmail: string | null; idLiceo: string | null }) {
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
        const { data, error } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('correo', userEmail.toLowerCase())
          .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Perfil no encontrado');

        // Asegurar que los arrays existan
        setPerfil({
          ...data,
          intereses: data.intereses || [],
          pasatiempos: data.pasatiempos || [],
          formacion: data.formacion || [],
          experiencia_laboral: data.experiencia_laboral || [],
          habilidades: data.habilidades || [],
        });
        setEditForm(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, [userEmail, supabase]);

  const guardarCambios = async () => {
    if (!perfil) return;
    const { error } = await supabase
      .from('estudiantes')
      .update(editForm)
      .eq('id', perfil.id);
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setPerfil({ ...perfil, ...editForm });
      setEditando(false);
      alert('Perfil actualizado');
    }
  };

  // Barra de progreso circular
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r={radius} stroke="#f97316" strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        <text x="50" y="55" textAnchor="middle" fill="#1a365d" fontSize="16" fontWeight="bold" transform="rotate(90 50 50)">{percentage}%</text>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a365d]" />
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error || 'Perfil no disponible'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-[#1a365d] text-white px-4 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    );
  }

  const progreso = perfil.completitud_perfil || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="relative bg-gradient-to-r from-[#1a365d] to-[#2563eb] rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              {perfil.foto_url ? (
                <img src={perfil.foto_url} alt="Foto" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#f97316] to-[#ffb347] flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={48} className="text-white" />
                </div>
              )}
              <button className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-100">
                <Camera size={18} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}</h1>
              <p className="text-[#f97316] font-semibold">{perfil.especialidad}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-200">
                <span className="flex items-center gap-1"><Mail size={14} /> {perfil.correo}</span>
                {perfil.telefono && <span className="flex items-center gap-1"><Phone size={14} /> {perfil.telefono}</span>}
                {perfil.direccion && <span className="flex items-center gap-1"><MapPin size={14} /> {perfil.direccion}</span>}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgress percentage={progreso} />
              <button onClick={() => setEditando(!editando)} className="mt-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                <Edit3 size={14} /> {editando ? 'Cancelar' : 'Editar perfil'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {editando ? (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1a365d] mb-4">Editar perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Teléfono</label><input type="text" value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium">Fecha nacimiento</label><input type="date" value={editForm.fecha_nacimiento || ''} onChange={e => setEditForm({...editForm, fecha_nacimiento: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium">Dirección</label><input type="text" value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium">Teléfono emergencia</label><input type="text" value={editForm.telefono_emergencia || ''} onChange={e => setEditForm({...editForm, telefono_emergencia: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium">Biografía</label><textarea rows={3} value={editForm.biografia || ''} onChange={e => setEditForm({...editForm, biografia: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium">LinkedIn</label><input type="url" value={editForm.linkedin_url || ''} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm font-medium">GitHub</label><input type="url" value={editForm.github_url || ''} onChange={e => setEditForm({...editForm, github_url: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setEditando(false)} className="px-4 py-2 border rounded">Cancelar</button>
            <button onClick={guardarCambios} className="px-4 py-2 bg-[#f97316] text-white rounded hover:bg-orange-600">Guardar cambios</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><User size={18} /> Datos personales</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Teléfono:</span> {perfil.telefono || '—'}</p>
                <p><span className="font-medium">Fecha nac.:</span> {perfil.fecha_nacimiento || '—'}</p>
                <p><span className="font-medium">Dirección:</span> {perfil.direccion || '—'}</p>
                <p><span className="font-medium">Tel. emergencia:</span> {perfil.telefono_emergencia || '—'}</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><Share2 size={18} /> Redes</h3>
              <div className="space-y-2">
                {perfil.linkedin_url ? <a href={perfil.linkedin_url} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">LinkedIn</a> : <p className="text-sm text-gray-400">No agregado</p>}
                {perfil.github_url ? <a href={perfil.github_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-800 hover:underline">GitHub</a> : <p className="text-sm text-gray-400">No agregado</p>}
              </div>
            </div>
          </div>

          {/* Columna central */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><FileText size={18} /> Sobre mí</h3>
              <p className="text-gray-700">{perfil.biografia || 'Sin biografía aún.'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><GraduationCap size={18} /> Formación académica</h3>
              {perfil.formacion?.length ? perfil.formacion.map((f, i) => (
                <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2">
                  <p className="font-medium">{f.titulo}</p>
                  <p className="text-sm text-gray-500">{f.institucion} • {f.anio}</p>
                </div>
              )) : <p className="text-gray-500">No hay formación agregada.</p>}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><Briefcase size={18} /> Experiencia</h3>
              {perfil.experiencia_laboral?.length ? perfil.experiencia_laboral.map((e, i) => (
                <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2">
                  <p className="font-medium">{e.cargo} en {e.empresa}</p>
                  <p className="text-sm text-gray-500">{e.anio_inicio} - {e.anio_fin || 'actualidad'}</p>
                </div>
              )) : <p className="text-gray-500">Sin experiencia registrada.</p>}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><Award size={18} /> Habilidades</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {perfil.habilidades?.map(h => <span key={h} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{h}</span>)}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="font-semibold text-lg text-[#1a365d] flex items-center gap-2 mb-4"><Heart size={18} /> Intereses y pasatiempos</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {perfil.intereses?.map(i => <span key={i} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm">❤️ {i}</span>)}
                {perfil.pasatiempos?.map(p => <span key={p} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">🎮 {p}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}