// app/components/dashboards/estudiante/EditProfileSidebar.tsx
'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EstudiantePerfil } from './types';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  perfil: EstudiantePerfil;
  onSave: (data: Partial<EstudiantePerfil>) => Promise<void>;
}

export default function EditProfileSidebar({ isOpen, onClose, perfil, onSave }: Props) {
  const [formData, setFormData] = useState(perfil);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
          
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Editar Perfil</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input type="text" value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                  <input type="text" value={formData.direccion || ''} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sobre Mí</label>
                  <textarea rows={4} value={formData.biografia || ''} onChange={e => setFormData({...formData, biografia: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-shadow resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL LinkedIn</label>
                  <input type="url" value={formData.linkedin_url || ''} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL GitHub</label>
                  <input type="url" value={formData.github_url || ''} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-shadow" />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button form="edit-form" type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#1a365d] hover:bg-[#112440] rounded-lg transition-colors">
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}