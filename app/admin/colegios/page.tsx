'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import { supabase } from '@/app/lib/supabaseClient';

const COLORES = {
  azul: '#1a365d',
  naranja: '#f97316',
  fondo: '#f1f5f9',
  borde: '#e2e8f0',
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: COLORES.fondo, fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' as 'column' },
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' },
  card: { backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(26, 54, 93, 0.08)', maxWidth: '42rem', width: '100%', padding: '2.5rem 2rem', border: `1px solid ${COLORES.borde}`, position: 'relative' as 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' as 'column', gap: '2rem' },
  topBar: { position: 'absolute' as 'absolute', top: 0, left: 0, right: 0, height: '5px', background: `linear-gradient(90deg, ${COLORES.azul} 0%, ${COLORES.naranja} 100%)` },
  cardHeader: { textAlign: 'center' as 'center' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 },
  subtitle: { fontSize: '0.9rem', color: '#64748b', margin: '0.4rem 0 0 0' },
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '1.75rem' },
  section: { borderBottom: `1px solid ${COLORES.borde}`, paddingBottom: '1.5rem', display: 'flex', flexDirection: 'column' as 'column', gap: '1.25rem' },
  sectionTitle: { fontSize: '0.8rem', fontWeight: 700, color: COLORES.azul, textTransform: 'uppercase' as 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' },
  sectionDot: { width: '6px', height: '6px', backgroundColor: COLORES.naranja, borderRadius: '50%' },
  gridMd: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '0.375rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#334155', margin: 0 },
  input: { width: '100%', padding: '0.6rem 0.85rem', border: `1px solid ${COLORES.borde}`, borderRadius: '0.375rem', fontSize: '0.9rem', backgroundColor: 'white', outline: 'none' },
  select: { appearance: 'none' as 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.1em', paddingRight: '2.5rem' },
  button: { width: '100%', backgroundColor: COLORES.azul, color: 'white', fontWeight: 600, fontSize: '0.95rem', padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' },
  ayuda: { fontSize: '0.75rem', color: '#0284c7', margin: '0.2rem 0 0 0', fontWeight: 500 }
};

export default function RegistrarColegioPage() {
  const [rbd, setRbd] = useState('');
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [dependencia, setDependencia] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [buscando, setBuscando] = useState(false);

  // FUNCIÓN OFICIAL ADAPTADA A TUS COLUMNAS MINÚSCULAS
  const manejarBusquedaRbd = async () => {
    if (!rbd || rbd.length < 1) return;
    
    setBuscando(true);
    try {
      const rbdNumero = parseInt(rbd, 10);

      // Consultamos usando las columnas reales de tu Supabase
      const { data, error } = await supabase
        .from('colegios_mineduc')
        .select('nombre, region, comuna, dependencia')
        .eq('rbd', rbdNumero)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Mapeamos el código numérico de la columna dependencia al texto del select
        let textoDependencia = '';
        const depe = parseInt(data.dependencia, 10);
        
        if (depe === 1) textoDependencia = 'Municipal';
        if (depe === 5) textoDependencia = 'Servicio Local (SLEP)';
        if (depe === 2) textoDependencia = 'Particular Subvencionado';
        if (depe === 4) textoDependencia = 'Administración Delegada';

        // Rellenamos el formulario
        setNombre(data.nombre || '');
        setRegion(data.region || '');
        setComuna(data.comuna || '');
        setDependencia(textoDependencia);
      } else {
        alert(`El RBD ${rbd} no se encuentra en tu base de datos de Supabase.`);
      }
    } catch (err: any) {
      console.error('Error en consulta Supabase:', err);
      alert(`Error de conexión: ${err.message}`);
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rbd, nombre, comuna, region, dependencia, adminEmail });
    alert('🚀 ¡Institución registrada exitosamente en el ecosistema!');
  };

  return (
    <div style={styles.page}>
      <Header />

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.topBar}></div>
          
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Registrar Nueva Institución TP</h1>
            <p style={styles.subtitle}>Ingresa el RBD para autocompletar la información oficial del establecimiento.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <div style={styles.sectionDot}></div>
                1. Datos del Establecimiento
              </h2>
              
              <div style={styles.gridMd}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>RBD del Colegio</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Ej: 1" 
                    style={styles.input} 
                    value={rbd} 
                    onChange={(e) => setRbd(e.target.value)}
                    onBlur={manejarBusquedaRbd}
                  />
                  {buscando && <p style={styles.ayuda}>🔍 Buscando en registros del MINEDUC...</p>}
                  {!buscando && rbd && <p style={styles.ayuda}>💡 Haz clic fuera de la casilla para autocompletar</p>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nombre de la Institución</label>
                  <input type="text" required placeholder="Se autocompletará solo" style={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div style={styles.inputGroup}>
                  <label style={{ ...styles.label }}>Región</label>
                  <input type="text" required placeholder="Se autocompletará solo" style={styles.input} value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Comuna</label>
                  <input type="text" required placeholder="Se autocompletará solo" style={styles.input} value={comuna} onChange={(e) => setComuna(e.target.value)} />
                </div>

                <div style={{...styles.inputGroup, gridColumn: 'span 2'}}>
                  <label style={styles.label}>Dependencia administrativa</label>
                  <select required style={{...styles.input, ...styles.select}} value={dependencia} onChange={(e) => setDependencia(e.target.value)} >
                    <option value="">Selecciona la dependencia...</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Servicio Local (SLEP)">Servicio Local (SLEP)</option>
                    <option value="Particular Subvencionado">Particular Subvencionado</option>
                    <option value="Administración Delegada">Administración Delegada</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{...styles.section, borderBottom: 'none', paddingBottom: 0}}>
              <h2 style={styles.sectionTitle}>
                <div style={styles.sectionDot}></div>
                2. Administrador del Establecimiento
              </h2>
              <p style={{...styles.subtitle, fontSize: '0.85rem', marginBottom: '0.5rem'}}>
                Se enviará un acceso seguro para que el administrador complete el equipo escolar.
              </p>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Electrónico de Contacto</label>
                <input type="email" required placeholder="director@liceo.cl" style={styles.input} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>
            </div>

            <button type="submit" style={styles.button}>
              <p style={{margin: 0}}>Registrar e Invitar por Correo</p>
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}