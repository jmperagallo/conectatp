'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit, Trash2, X, Upload, Download, CheckCircle, Loader2 } from 'lucide-react';

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
  const [subiendo, setSubiendo] = useState(false);
  const [resultadoCarga, setResultadoCarga] = useState<{ ok: number; errors: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const cargarEstudiantes = async () => {
    if (!idLiceo || !profesor?.especialidad) return;
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('id_liceo', idLiceo)
      .eq('especialidad', profesor.especialidad);
    if (!error && data) setEstudiantes(data);
  };

  useEffect(() => {
    if (!userEmail || !idLiceo) return;
    const cargarDatos = async () => {
      setLoading(true);
      const { data: profe, error: errProfe } = await supabase
        .from('lista_blanca')
        .select('nombre, apellido_paterno, especialidad')
        .eq('correo', userEmail)
        .single();
      if (errProfe) console.error(errProfe);
      else setProfesor(profe);
      if (profe?.especialidad) {
        const { data: estudiantesData } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('id_liceo', idLiceo)
          .eq('especialidad', profe.especialidad);
        if (estudiantesData) setEstudiantes(estudiantesData);
      }
      setLoading(false);
    };
    cargarDatos();
  }, [userEmail, idLiceo, supabase]);

  // ✅ Validador de RUT chileno
  const validarRut = (rut: string): boolean => {
    const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length < 2) return false;
    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dvCalculado === dv;
  };

  // ✅ Validador de correo
  const validarCorreo = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ Formateador de RUT (para mostrar bonito, opcional)
  const formatearRut = (rut: string): string => {
    let clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return rut;
    let dv = clean.slice(-1);
    let cuerpo = clean.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return cuerpo + '-' + dv.toUpperCase();
  };

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
    if (!validarRut(formData.rut)) {
      alert('RUT inválido. Formato: 12345678-5 o 12.345.678-5');
      return;
    }
    if (!validarCorreo(formData.correo)) {
      alert('Correo electrónico inválido');
      return;
    }
    const payload = {
      id_liceo: idLiceo,
      nombre: formData.nombre.trim(),
      apellido_paterno: formData.apellido_paterno.trim(),
      apellido_materno: formData.apellido_materno.trim(),
      rut: formData.rut.replace(/[^0-9kK]/g, '').toUpperCase(),
      correo: formData.correo.trim().toLowerCase(),
      telefono: formData.telefono.trim(),
      especialidad: formData.especialidad,
      perfil_completo: false,
    };
    let error;
    if (editando) {
      const { error: err } = await supabase.from('estudiantes').update(payload).eq('id', editando.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('estudiantes').insert(payload);
      error = err;
    }
    if (error) alert(`Error: ${error.message}`);
    else {
      alert(editando ? 'Estudiante actualizado' : 'Estudiante agregado');
      setModalAbierto(false);
      cargarEstudiantes();
    }
  };

  const handleEliminarEstudiante = async (id: string) => {
    if (confirm('¿Eliminar estudiante?')) {
      const { error } = await supabase.from('estudiantes').delete().eq('id', id);
      if (error) alert(`Error: ${error.message}`);
      else setEstudiantes(estudiantes.filter(e => e.id !== id));
    }
  };

  // 📥 Descargar plantilla CSV con instrucciones y ejemplo
  const descargarPlantilla = () => {
    const instrucciones = `# INSTRUCCIONES PARA LLENAR EL ARCHIVO CSV
- Usa solo letras y espacios en nombres y apellidos.
- RUT: solo números y guión (formato: 12345678-9 o 12.345.678-9). El sistema valida el dígito verificador.
- Correo: debe ser válido (ejemplo@dominio.cl).
- Teléfono: opcional, puedes dejarlo vacío. Formato sugerido: +56912345678 o 912345678.

Ejemplo de fila válida:
Juan,Pérez,González,12345678-5,juan.perez@escuela.cl,+56912345678

`;
    const encabezados = 'nombre,apellido_paterno,apellido_materno,rut,correo,telefono\n';
    const ejemplo = 'Juan,Pérez,González,12345678-5,juan.perez@escuela.cl,+56912345678\n';
    const contenido = instrucciones + encabezados + ejemplo;
    const blob = new Blob([contenido], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_estudiantes_con_instrucciones.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 📤 Procesar archivo CSV
  const procesarCSV = async (file: File) => {
    return new Promise<{ estudiantes: any[]; errores: any[] }>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        if (lines.length === 0) {
          resolve({ estudiantes: [], errores: [{ fila: 0, error: 'Archivo vacío o solo comentarios' }] });
          return;
        }
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const estudiantes = [];
        const errores = [];
        for (let i = 1; i < lines.length; i++) {
          const valores = lines[i].split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((h, idx) => { obj[h] = valores[idx] || ''; });
          if (!obj.nombre || !obj.apellido_paterno || !obj.rut || !obj.correo) {
            errores.push({ fila: i+1, error: 'Faltan campos obligatorios (nombre, apellido_paterno, rut, correo)' });
            continue;
          }
          if (!validarRut(obj.rut)) {
            errores.push({ fila: i+1, error: `RUT inválido: ${obj.rut}` });
            continue;
          }
          if (!validarCorreo(obj.correo)) {
            errores.push({ fila: i+1, error: `Correo inválido: ${obj.correo}` });
            continue;
          }
          estudiantes.push({
            id_liceo: idLiceo,
            nombre: obj.nombre,
            apellido_paterno: obj.apellido_paterno,
            apellido_materno: obj.apellido_materno || '',
            rut: obj.rut.replace(/[^0-9kK]/g, '').toUpperCase(),
            correo: obj.correo.toLowerCase(),
            telefono: obj.telefono || '',
            especialidad: profesor?.especialidad,
            perfil_completo: false,
          });
        }
        resolve({ estudiantes, errores });
      };
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('Solo se permiten archivos CSV');
      return;
    }
    setSubiendo(true);
    setResultadoCarga(null);
    try {
      const { estudiantes: estudiantesData, errores } = await procesarCSV(file);
      if (estudiantesData.length === 0) {
        alert('No hay estudiantes válidos para cargar');
        return;
      }
      const { error: insertError } = await supabase
        .from('estudiantes')
        .upsert(estudiantesData, { onConflict: 'rut' });
      if (insertError) throw new Error(insertError.message);
      setResultadoCarga({ ok: estudiantesData.length, errors: errores });
      await cargarEstudiantes();
    } catch (err: any) {
      alert(`Error al cargar: ${err.message}`);
    } finally {
      setSubiendo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <div className="text-center py-10">Cargando datos...</div>;

  const completados = estudiantes.filter(e => e.perfil_completo).length;

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#f97316', textTransform: 'uppercase' }}>Panel del Jefe de Especialidad</span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: 0 }}>
          Bienvenido, {profesor?.nombre} {profesor?.apellido_paterno}
        </h1>
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

      {/* Caja de instrucciones */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '14px' }}>📘 Cómo cargar estudiantes masivamente</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e3a8a', fontSize: '13px', lineHeight: '1.5' }}>
          <li>Descarga la plantilla CSV usando el botón <strong>"Descargar Plantilla CSV"</strong>.</li>
          <li>La plantilla incluye instrucciones y un ejemplo.</li>
          <li><strong>Columnas obligatorias:</strong> nombre, apellido_paterno, rut, correo.</li>
          <li><strong>RUT:</strong> solo números y guión (ej: 12345678-5). El sistema valida el dígito verificador.</li>
          <li><strong>Correo:</strong> debe ser válido (ejemplo@dominio.cl).</li>
          <li><strong>Teléfono:</strong> opcional (formato sugerido: +56912345678).</li>
          <li>No modifiques los encabezados de la primera fila.</li>
        </ul>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={descargarPlantilla} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} /> Descargar Plantilla CSV
        </button>
        <input type="file" ref={fileInputRef} accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
        <button onClick={() => fileInputRef.current?.click()} disabled={subiendo} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: subiendo ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {subiendo ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {subiendo ? 'Subiendo...' : 'Carga Masiva (CSV)'}
        </button>
        <button onClick={() => handleAbrirModal()} style={{ backgroundColor: '#1a365d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Agregar Estudiante
        </button>
      </div>

      {/* Resultado de carga */}
      {resultadoCarga && (
        <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', backgroundColor: resultadoCarga.errors.length ? '#fee2e2' : '#d1fae5', color: resultadoCarga.errors.length ? '#991b1b' : '#065f46' }}>
          <strong>{resultadoCarga.ok} estudiantes cargados exitosamente.</strong>
          {resultadoCarga.errors.length > 0 && (
            <details style={{ marginTop: '8px' }}>
              <summary>{resultadoCarga.errors.length} errores encontrados</summary>
              <ul style={{ marginTop: '8px', fontSize: '12px' }}>
                {resultadoCarga.errors.map((err, idx) => <li key={idx}>Fila {err.fila}: {err.error}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}

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
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No hay estudiantes registrados aún. Usa la carga masiva o agrega uno manualmente.</td></tr>
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
              <input type="text" placeholder="Nombres *" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Apellido Paterno *" value={formData.apellido_paterno} onChange={e => setFormData({...formData, apellido_paterno: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Apellido Materno" value={formData.apellido_materno} onChange={e => setFormData({...formData, apellido_materno: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="RUT * (ej: 12345678-5)" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="email" placeholder="Correo *" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Teléfono (opcional)" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }} />
              <input type="text" placeholder="Especialidad" value={formData.especialidad} disabled style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
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