// app/components/dashboards/estudiante/RightColumn.tsx
'use client';

import { EstudiantePerfil } from './types';
import { motion } from 'framer-motion';
import { Award, Heart, Video, Briefcase, GraduationCap, FileText } from 'lucide-react';

export default function RightColumn({ perfil }: { perfil: EstudiantePerfil }) {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" } };

  return (
    <div className="space-y-8 pb-12">
      {/* Sobre mí */}
      <motion.section {...fadeInUp} className="bg-white rounded-2xl p-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><FileText size={20} /> Sobre mí</h2>
        <p className="text-slate-600 leading-relaxed text-sm">{perfil.biografia || 'Escribe un breve resumen sobre tus intereses técnicos y lo que buscas en tu próxima experiencia profesional.'}</p>
      </motion.section>

      {/* Experiencia y Formación (timeline) */}
      <motion.section {...fadeInUp} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Trayectoria profesional y académica</h2>
        <div className="space-y-8 border-l border-slate-200 ml-3">
          {perfil.experiencia_laboral?.map((exp, idx) => (
            <div key={`exp-${idx}`} className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#f97316] ring-4 ring-white" />
              <h3 className="text-base font-medium text-slate-900">{exp.cargo}</h3>
              <p className="text-sm text-slate-500">{exp.empresa} • {exp.anio_inicio} - {exp.anio_fin || 'Presente'}</p>
            </div>
          ))}
          {perfil.formacion?.map((edu, idx) => (
            <div key={`edu-${idx}`} className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
              <h3 className="text-base font-medium text-slate-900">{edu.titulo}</h3>
              <p className="text-sm text-slate-500">{edu.institucion} • {edu.anio || 'En curso'}</p>
            </div>
          ))}
          {(!perfil.experiencia_laboral?.length && !perfil.formacion?.length) && <p className="pl-6 text-sm text-slate-400 italic">Aún no hay registros de trayectoria.</p>}
        </div>
      </motion.section>

      {/* Habilidades técnicas */}
      <motion.section {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Award size={20} /> Competencias técnicas</h2>
        <div className="flex flex-wrap gap-2">
          {perfil.habilidades?.map((skill, idx) => <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium border border-slate-200/60">{skill}</span>)}
          {!perfil.habilidades?.length && <p className="text-sm text-slate-400 italic">No se han agregado competencias.</p>}
        </div>
      </motion.section>

      {/* Intereses y pasatiempos */}
      <motion.section {...fadeInUp} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Heart size={20} /> Intereses y pasatiempos</h2>
        <div className="flex flex-wrap gap-2">
          {perfil.intereses?.map((i, idx) => <span key={`i-${idx}`} className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-md text-sm font-medium border border-pink-100">❤️ {i}</span>)}
          {perfil.pasatiempos?.map((p, idx) => <span key={`p-${idx}`} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-100">🎮 {p}</span>)}
          {(!perfil.intereses?.length && !perfil.pasatiempos?.length) && <p className="text-sm text-slate-400 italic">No se han agregado intereses o pasatiempos.</p>}
        </div>
      </motion.section>

      {/* Video presentación */}
      {perfil.video_presentacion_url && (
        <motion.section {...fadeInUp} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Video size={20} /> Video de presentación</h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
            <video src={perfil.video_presentacion_url} controls className="w-full h-full object-cover" />
          </div>
        </motion.section>
      )}
    </div>
  );
}