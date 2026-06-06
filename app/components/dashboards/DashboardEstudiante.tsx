'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, Briefcase, GraduationCap, Heart, Globe, Camera, 
  Edit3, Mail, Phone, MapPin, Calendar, Award, FileText,
  Linkedin, Github, Save, X, CheckCircle, TrendingUp
} from 'lucide-react';

// ... (interfaces y lógica de carga similar a antes, pero la mejora está en el JSX/estilos)

export default function DashboardEstudiante({ userEmail }: Props) {
  // ... (mismo código de carga y estado)

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!perfil) return <NotFoundMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tarjeta de perfil principal (Glassmorphism + gradiente) */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-slate-700/50 mb-8 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/10 via-[#f97316]/5 to-transparent"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Foto de perfil con anillo gradiente */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#f97316] blur-md opacity-70"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-gradient-to-br from-[#1a365d] to-[#f97316]">
                  {perfil.foto_url ? (
                    <img src={perfil.foto_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white">
                      <User size={48} />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-slate-700 hover:scale-105 transition-transform">
                    <Camera size={16} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Información principal */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1a365d] to-[#f97316] bg-clip-text text-transparent">
                  {perfil.nombre} {perfil.apellido_paterno} {perfil.apellido_materno}
                </h1>
                <p className="text-[#f97316] font-semibold mt-1">{perfil.especialidad}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-full"><Mail size={14} /> {perfil.correo}</span>
                  {perfil.telefono && <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-full"><Phone size={14} /> {perfil.telefono}</span>}
                  {perfil.direccion && <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-full"><MapPin size={14} /> {perfil.direccion}</span>}
                </div>
              </div>

              {/* Progreso y acción */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                    <circle cx="48" cy="48" r="42" stroke="#f97316" strokeWidth="6" fill="none" 
                      strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - (perfil.completitud_perfil || 0)/100)}`} 
                      strokeLinecap="round" className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#1a365d] dark:text-white">{perfil.completitud_perfil || 0}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setEditando(!editando)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a365d] text-white hover:bg-[#2a4a7d] transition-colors shadow-md hover:shadow-lg"
                >
                  <Edit3 size={16} /> {editando ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {editando ? (
          // Formulario de edición (simplificado, pero elegante)
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-[#1a365d] dark:text-white mb-4">Editar perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="text" value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" /></div>
              <div><label className="block text-sm font-medium mb-1">Fecha nacimiento</label><input type="date" value={editForm.fecha_nacimiento || ''} onChange={e => setEditForm({...editForm, fecha_nacimiento: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" /></div>
              <div><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Teléfono emergencia</label><input type="text" value={editForm.telefono_emergencia || ''} onChange={e => setEditForm({...editForm, telefono_emergencia: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Biografía</label><textarea rows={3} value={editForm.biografia || ''} onChange={e => setEditForm({...editForm, biografia: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input type="url" value={editForm.linkedin_url || ''} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">GitHub</label><input type="url" value={editForm.github_url || ''} onChange={e => setEditForm({...editForm, github_url: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditando(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">Cancelar</button>
              <button onClick={guardarCambios} className="px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600">Guardar cambios</button>
            </div>
          </div>
        ) : (
          // Vista de perfil (diseño en tarjetas estilo Bento Grid)
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><User size={18} /> Datos personales</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Teléfono:</span> {perfil.telefono || '—'}</p>
                  <p><span className="font-medium">Fecha nac.:</span> {perfil.fecha_nacimiento || '—'}</p>
                  <p><span className="font-medium">Dirección:</span> {perfil.direccion || '—'}</p>
                  <p><span className="font-medium">Tel. emergencia:</span> {perfil.telefono_emergencia || '—'}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><Globe size={18} /> Redes</h3>
                <div className="space-y-2">
                  {perfil.linkedin_url && <a href={perfil.linkedin_url} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><Linkedin size={16} /> LinkedIn</a>}
                  {perfil.github_url && <a href={perfil.github_url} target="_blank" className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 hover:underline"><Github size={16} /> GitHub</a>}
                  {!perfil.linkedin_url && !perfil.github_url && <p className="text-sm text-gray-400">No agregadas</p>}
                </div>
              </div>
            </div>

            {/* Columna central y derecha (secciones principales) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-2"><FileText size={18} /> Sobre mí</h3>
                <p className="text-gray-700 dark:text-gray-300">{perfil.biografia || 'Sin biografía aún.'}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><GraduationCap size={18} /> Formación</h3>
                {perfil.formacion?.length ? perfil.formacion.map((f, i) => <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2"><p className="font-medium">{f.titulo}</p><p className="text-sm text-gray-500">{f.institucion} • {f.anio}</p></div>) : <p className="text-gray-500">No hay formación</p>}
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><Briefcase size={18} /> Experiencia</h3>
                {perfil.experiencia_laboral?.length ? perfil.experiencia_laboral.map((e, i) => <div key={i} className="border-l-2 border-[#f97316] pl-3 py-1 mt-2"><p className="font-medium">{e.cargo} en {e.empresa}</p><p className="text-sm text-gray-500">{e.anio_inicio} - {e.anio_fin || 'actual'}</p></div>) : <p className="text-gray-500">Sin experiencia</p>}
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><Award size={18} /> Habilidades</h3>
                <div className="flex flex-wrap gap-2">{perfil.habilidades?.map(h => <span key={h} className="bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm">{h}</span>)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-[#1a365d] dark:text-white flex items-center gap-2 mb-3"><Heart size={18} /> Intereses y pasatiempos</h3>
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