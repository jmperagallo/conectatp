// app/components/dashboards/DashboardEstudiante.tsx
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, Briefcase, GraduationCap, Heart, Globe, Camera, 
  Edit3, Mail, Phone, MapPin, Calendar, Award, FileText,
  Code, Share2, Save, X, CheckCircle, TrendingUp, Sparkles
} from 'lucide-react';

// ... (interfaces y lógica de carga sin cambios, pero la mejor visual está en el JSX)

export default function DashboardEstudiante({ userEmail }: Props) {
  // ... (mismo código de carga y estado, incluyendo guardarCambios)

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f97316]"></div></div>;
  if (error) return <div className="text-center p-8 bg-red-50 rounded-2xl text-red-600">{error}</div>;
  if (!perfil) return <div className="text-center p-8 bg-yellow-50 rounded-2xl text-yellow-700">Perfil no encontrado.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero card con efecto glassmorphism mejorado */}
        <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-white/30 dark:border-slate-700/50 mb-12 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/5 via-[#f97316]/5 to-transparent"></div>
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
              {/* Avatar con anillo gradiente y animación */}
              <div className="relative shrink-0 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#f97316] blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-gradient-to-br from-[#1a365d] to-[#f97316]">
                  {perfil.foto_url ? (
                    <img src={perfil.foto_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white">
                      <User size={56} />
                    </div>
                  )}
                  <button className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur rounded-full p-1.5 shadow-md hover:scale-110 transition-transform">
                    <Camera size={18} className="text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              </div>

              {/* Información principal */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1a365d] to-[#f97316] bg-clip-text text-transparent">
                  {perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20">
                    {perfil.especialidad}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-slate-700/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                    <Mail size={14} /> {perfil.correo}
                  </div>
                  {perfil.telefono && (
                    <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-slate-700/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                      <Phone size={14} /> {perfil.telefono}
                    </div>
                  )}
                  {perfil.direccion && (
                    <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-slate-700/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                      <MapPin size={14} /> {perfil.direccion}
                    </div>
                  )}
                </div>
              </div>

              {/* Progreso y edición */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="50" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                    <circle cx="56" cy="56" r="50" stroke="#f97316" strokeWidth="6" fill="none" 
                      strokeDasharray={`${2 * Math.PI * 50}`} strokeDashoffset={`${2 * Math.PI * 50 * (1 - (perfil.completitud_perfil || 0)/100)}`} 
                      strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#1a365d] dark:text-white">{perfil.completitud_perfil || 0}%</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">completo</span>
                  </div>
                </div>
                <button 
                  onClick={() => setEditando(!editando)} 
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#1a365d] to-[#2a4a7d] text-white font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Edit3 size={16} /> {editando ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {editando ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-[#1a365d] dark:text-white mb-6 flex items-center gap-2"><Sparkles size={22} /> Editar perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="text" value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" /></div>
              <div><label className="block text-sm font-medium mb-1">Fecha nacimiento</label><input type="date" value={editForm.fecha_nacimiento || ''} onChange={e => setEditForm({...editForm, fecha_nacimiento: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#f97316]" /></div>
              <div><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label className="block text-sm font-medium mb-1">Teléfono emergencia</label><input type="text" value={editForm.telefono_emergencia || ''} onChange={e => setEditForm({...editForm, telefono_emergencia: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Biografía</label><textarea rows={4} value={editForm.biografia || ''} onChange={e => setEditForm({...editForm, biografia: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input type="url" value={editForm.linkedin_url || ''} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label className="block text-sm font-medium mb-1">GitHub</label><input type="url" value={editForm.github_url || ''} onChange={e => setEditForm({...editForm, github_url: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setEditando(false)} className="px-5 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cancelar</button>
              <button onClick={guardarCambios} className="px-5 py-2 bg-gradient-to-r from-[#f97316] to-[#ff8c42] text-white rounded-xl shadow-md hover:shadow-lg transition">Guardar cambios</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 transition-all hover:shadow-lg">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><User size={20} /> Datos personales</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Teléfono:</span> {perfil.telefono || '—'}</p>
                  <p><span className="font-medium">Fecha nac.:</span> {perfil.fecha_nacimiento || '—'}</p>
                  <p><span className="font-medium">Dirección:</span> {perfil.direccion || '—'}</p>
                  <p><span className="font-medium">Tel. emergencia:</span> {perfil.telefono_emergencia || '—'}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 transition-all hover:shadow-lg">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><Globe size={20} /> Redes sociales</h3>
                <div className="space-y-2">
                  {perfil.linkedin_url && <a href={perfil.linkedin_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline"><Share2 size={18} /> LinkedIn</a>}
                  {perfil.github_url && <a href={perfil.github_url} target="_blank" className="flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:underline"><Code size={18} /> GitHub</a>}
                  {!perfil.linkedin_url && !perfil.github_url && <p className="text-gray-400">No hay redes agregadas</p>}
                </div>
              </div>
            </div>

            {/* Columna derecha (2/3 del ancho) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><FileText size={20} /> Sobre mí</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{perfil.biografia || 'Sin biografía aún. Completa tu perfil para destacar ante las empresas.'}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><GraduationCap size={20} /> Formación académica</h3>
                {perfil.formacion?.length ? perfil.formacion.map((f, i) => (
                  <div key={i} className="border-l-4 border-[#f97316] pl-4 py-2 mb-3">
                    <p className="font-medium">{f.titulo}</p>
                    <p className="text-sm text-gray-500">{f.institucion} • {f.anio}</p>
                  </div>
                )) : <p className="text-gray-500">No hay formación registrada.</p>}
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><Briefcase size={20} /> Experiencia laboral</h3>
                {perfil.experiencia_laboral?.length ? perfil.experiencia_laboral.map((e, i) => (
                  <div key={i} className="border-l-4 border-[#f97316] pl-4 py-2 mb-3">
                    <p className="font-medium">{e.cargo} en {e.empresa}</p>
                    <p className="text-sm text-gray-500">{e.anio_inicio} - {e.anio_fin || 'actualidad'}</p>
                  </div>
                )) : <p className="text-gray-500">Sin experiencia registrada.</p>}
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><Award size={20} /> Habilidades</h3>
                <div className="flex flex-wrap gap-2">{perfil.habilidades?.map(h => <span key={h} className="bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-sm">{h}</span>)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-[#1a365d] dark:text-white flex items-center gap-2 mb-4"><Heart size={20} /> Intereses y pasatiempos</h3>
                <div className="flex flex-wrap gap-2">
                  {perfil.intereses?.map(i => <span key={i} className="bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 px-3 py-1.5 rounded-full text-sm">❤️ {i}</span>)}
                  {perfil.pasatiempos?.map(p => <span key={p} className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1.5 rounded-full text-sm">🎮 {p}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}