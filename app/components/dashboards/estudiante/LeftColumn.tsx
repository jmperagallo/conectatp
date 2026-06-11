'use client';

import { EstudiantePerfil } from './types';
import { Mail, Phone, MapPin, Link2, Code2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeftColumn({ perfil }: { perfil: EstudiantePerfil }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Contacto */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contacto</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={16} className="shrink-0" />
            <span className="break-all">{perfil.correo}</span>
          </div>
          {perfil.telefono && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>{perfil.telefono}</span>
            </div>
          )}
          {perfil.direccion && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0" />
              <span>{perfil.direccion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enlaces profesionales */}
      {(perfil.linkedin_url || perfil.github_url) && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enlaces</h2>
          <div className="mt-3 space-y-2">
            {perfil.linkedin_url && (
              <a
                href={perfil.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#0077b5] hover:underline"
              >
                <Link2 size={16} /> LinkedIn
              </a>
            )}
            {perfil.github_url && (
              <a
                href={perfil.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 hover:underline"
              >
                <Code2 size={16} /> GitHub
              </a>
            )}
          </div>
        </div>
      )}

      {/* Descargar CV (placeholder) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <button className="w-full py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
          <Download size={16} /> Descargar CV
        </button>
      </div>
    </motion.div>
  );
}