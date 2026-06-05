'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, GraduationCap, CheckCircle, Plus, Edit, Trash2, X } from 'lucide-react';

interface Estudiante {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  correo: string;
  telefono?: string;
  especialidad: string;
  perfil_completo: boolean;
}

interface Props {
  userEmail: string | null;
  idLiceo: string | null;
}

export default function DashboardJefeEspecialidad({ userEmail, idLiceo }: Props) {
  const [profesor, setProfesor] = useState<{ nombre: string; apellido_paterno: string; especialidad: string } | null>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Estudiante | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    rut: '',
    correo: '',
    telefono: '',
    especialidad: ''
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Cargar datos del profesor y sus estudiantes
  useEffect(() => {
    if (!userEmail || !idLiceo) return;

    const cargarDatos = async () => {
      setLoading(true);
      // 1. Obtener datos del profesor (de lista_blanca)
      const { data: profe, error: errProfe } = await supabase
        .from('lista_blanca')
        .select('nombre, apellido_paterno, especialidad')
        .eq('correo', userEmail)
        .single();
      if (errProfe) console.error(errProfe);
      else setProfesor(profe);

      // 2. Obtener estudiantes del liceo (filtrados por especialidad del profesor)
      const { data: estudiantesData, error: errEst } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('id_liceo', idLiceo)
        .eq('especialidad', profe?.especialidad || '');
      if (errEst) console.error(errEst);
      else setEstudiantes(estudiantesData || []);

      setLoading(false);
    };
    cargarDatos();
  }, [userEmail, idLiceo, supabase]);

  const handleAbrirModal = (estudiante?: Estudiante) => {
    if (estudiante) {
      setEditando(estudiante);
      setFormData({
        nombre: estudiante.nombre,
        apellido_paterno: estudiante.apellido_paterno,
        apellido_materno: estudiante.apellido_materno,
        rut: estudiante.rut,
        correo: estudiante.correo,
        telefono: estudiante.telefono || '',
        especialidad: estudiante.especialidad,
      });
    } else {
      setEditando(null);
      setFormData({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        rut: '',
        correo: '',
        telefono: '',
        especialidad: profesor?.especialidad || '',
      });
    }
    setModalAbierto(true);
  };

  const handleGuardarEstudiante = async () => {
    if (!idLiceo) return;
    const payload = {
      id_liceo: idLiceo,
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      rut: formData.rut,
      correo: formData.correo,
      telefono: formData.telefono,
      especialidad: formData.especialidad,
      perfil_completo: false,
    };

    let error;
    if (editando) {
      // Actualizar
      const { error: err } = await supabase
        .from('estudiantes')
        .update(payload)
        .eq('id', editando.id);
      error = err;
    } else {
      // Insertar
      const { error: err } = await supabase.from('estudiantes').insert(payload);
      error = err;
    }

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(editando ? 'Estudiante actualizado' : 'Estudiante agregado');
      setModalAbierto(false);
      // Recargar lista
      const { data } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('id_liceo', idLiceo)
        .eq('especialidad', profesor?.especialidad || '');
      setEstudiantes(data || []);
    }
  };

  const handleEliminarEstudiante = async (id: string) => {
    if (confirm('¿Eliminar este estudiante?')) {
      const { error } = await supabase.from('estudiantes').delete().eq('id', id);
      if (error) alert(`Error: ${error.message}`);
      else {
        setEstudiantes(estudiantes.filter(e => e.id !== id));
      }
    }
  };

  if (loading) return <div className="text-center py-10">Cargando datos...</div>;

  const completados = estudiantes.filter(e => e.perfil_completo).length;

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#f97316', textTransform: 'uppercase' }}>Panel del Jefe de Especialidad</span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: 0 }}>Bienvenido, {profesor?.nombre} {profesor?.apellido_paterno}</h1>
        <p style={{ color: '#64748b' }}>Especialidad: <strong>{profesor?.especialidad}</strong></p>
        <p style={{ color: '#94a3b8', fontSize: '12px' }}>Sesión: {userEmail}</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1a365d' }}>{estudiantes.length}</div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Estudiantes Registrados</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>{completados}</div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Perfiles Completos</div>
        </div>
      </div>

      {/* Botón agregar estudiante */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => handleAbrirModal()} style={{ backgroundColor: '#1a365d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Agregar Estudiante
        </button>
      </div>

      {/* Tabla de estudiantes */}
      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>RUT</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '12px 16px', width: '100px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No hay estudiantes registrados aún.</td></tr>
            ) : (
              estudiantes.map(est => (
                <tr key={est.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px' }}>{est.nombre} {est.apellido_paterno} {est.apellido_materno}</td>
                  <td style={{ padding: '12px 16px' }}>{est.rut}</td>
                  <td style={{ padding: '12px 16px' }}>{est.correo}</td>
                  <td style={{ padding: '12px 16px' }}>{est.perfil_completo ? <CheckCircle size={18} color="#16a34a" /> : 'Pendiente'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleAbrirModal(est)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px' }}><Edit size={18} color="#3b82f6" /></button>
                    <button onClick={() => handleEliminarEstudiante(est.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18} color="#ef4444" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar estudiante */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '500px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{editando ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
              <button onClick={() => setModalAbierto(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Nombres" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Apellido Paterno" value={formData.apellido_paterno} onChange={e => setFormData({...formData, apellido_paterno: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Apellido Materno" value={formData.apellido_materno} onChange={e => setFormData({...formData, apellido_materno: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="RUT" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="email" placeholder="Correo" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Especialidad" value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f3f4f6' }} disabled={!!editando} />
              <button onClick={handleGuardarEstudiante} style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginTop: '12px' }}>
                {editando ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}