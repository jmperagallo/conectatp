'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Header from '@/app/components/Header';

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
  const router = useRouter();
  const [autenticando, setAutenticando] = useState(true);

  const [rbd, setRbd] = useState('');
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [dependencia, setDependencia] = useState('');
  const [buscando, setBuscando] = useState(false);

  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [listaCorreos, setListaCorreos] = useState<string[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const verificarAcceso = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setAutenticando(false);
      }
    };
    verificarAcceso();
  }, [router, supabase]);

  const agregarCorreoALista = () => {
    const correoLimpio = nuevoCorreo.trim().toLowerCase();
    if (!correoLimpio) return;
    
    if (!/\S+@\S+\.\S+/.test(correoLimpio)) {
      alert('Por favor, ingresa un formato de correo válido.');
      return;
    }

    if (listaCorreos.includes(correoLimpio)) {
      alert('Este correo ya fue agregado a la lista.');
      return;
    }

    setListaCorreos([...listaCorreos, correoLimpio]);
    setNuevoCorreo('');
  };

  const eliminarCorreoDeLista = (indexAEliminar: number) => {
    setListaCorreos(listaCorreos.filter((_, index) => index !== indexAEliminar));
  };

  const manejarBusquedaRbd = async () => {
    if (!rbd || rbd.length < 1) return;
    
    setBuscando(true);
    try {
      const rbdNumero = parseInt(rbd, 10);
      const { data, error } = await supabase
        .from('colegios_mineduc')
        .select('nombre, region, comuna, dependencia')
        .eq('rbd', rbdNumero)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        let textoDependencia = '';
        const depe = parseInt(data.dependencia, 10);
        
        if (depe === 1) textoDependencia = 'Municipal';
        if (depe === 5) textoDependencia = 'Servicio Local (SLEP)';
        if (depe === 2) textoDependencia = 'Particular Subvencionado';
        if (depe === 4) textoDependencia = 'Administración Delegada';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (listaCorreos.length === 0) {
      alert('⚠️ Debes agregar al menos un correo electrónico de contacto antes de registrar.');
      return;
    }

    setBuscando(true);

    try {
      // 1. Guardar o encontrar el colegio y OBTENER SU ID
      let liceoId = null;
      
      const { data: nuevoLiceo, error: dbError } = await supabase
        .from('liceos')
        .insert([
          {
            nombre: nombre,
            rbd: rbd,
            region: region,
            comuna: comuna
          }
        ])
        .select('id')
        .single();

      if (dbError) {
        if (dbError.code === '23505') {
          const { data: liceoExistente } = await supabase
            .from('liceos')
            .select('id')
            .eq('rbd', rbd)
            .single();
          liceoId = liceoExistente?.id;
        } else {
          throw new Error(`Error al registrar liceo en Supabase: ${dbError.message}`);
        }
      } else {
        liceoId = nuevoLiceo?.id;
      }

      if (!liceoId) throw new Error("Fallo crítico: No se obtuvo ID del liceo.");

      // 2. 🔥 ESTO FALTABA: GUARDAR LOS CORREOS EN LA LISTA BLANCA CON EL ROL CORRECTO 🔥
      const payloadsListaBlanca = listaCorreos.map(correo => ({
        correo: correo,
        rol: 'administrador_liceo', // <--- ¡AQUÍ ESTÁ LA MAGIA ARREGLADA!
        id_liceo: liceoId
      }));

      const { error: errLista } = await supabase
        .from('lista_blanca')
        .insert(payloadsListaBlanca);

      if (errLista) {
        alert(
          `🚨 FALLO AL GUARDAR CORREOS EN LA BASE DE DATOS 🚨\n\n` +
          `Código: ${errLista.code}\n` +
          `Mensaje: ${errLista.message}`
        );
        setBuscando(false);
        return; 
      }

      // 3. Ejecutar la llamada a la API para enviar correos
      const response = await fetch('/api/enviar-invitacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rbd,
          nombre,
          comuna,
          administradores: listaCorreos
        })
      });

      const resultadoEmail = await response.json();

      if (!resultadoEmail.enviado) {
        throw new Error(`Error en el servidor de correos: ${resultadoEmail.error}`);
      }

      alert(`✅ ¡Base de datos actualizada correctamente y correos despachados a "${nombre}"!`);
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      alert(`Hubo un problema en el proceso: ${err.message}`);
    } finally {
      setBuscando(false);
    }
  };

  if (autenticando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #1a365d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a365d', margin: 0 }}>Verificando credenciales de seguridad...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
                  <label style={styles.label}>Región</label>
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
                2. Administradores del Establecimiento
              </h2>
              <p style={{...styles.subtitle, fontSize: '0.85rem', marginBottom: '0.5rem'}}>
                Agrega uno o más correos institucionales. Se enviará una invitación segura a cada uno.
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <input 
                    type="email" 
                    placeholder="Ej: director@liceo.cl" 
                    style={styles.input} 
                    value={nuevoCorreo} 
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        agregarCorreoALista();
                      }
                    }}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={agregarCorreoALista}
                  style={{ backgroundColor: COLORES.naranja, color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.375rem', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', height: '38px' }}
                >
                  + Añadir
                </button>
              </div>

              {listaCorreos.length > 0 && (
                <div style={{ marginTop: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${COLORES.borde}`, borderRadius: '0.5rem', padding: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Correos por registrar ({listaCorreos.length}):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {listaCorreos.map((correo, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#334155' }}>
                        <span>{correo}</span>
                        <button 
                          type="button" 
                          onClick={() => eliminarCorreoDeLista(index)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px' }}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" style={styles.button}>
              <p style={{margin: 0}}>Registrar Ecosistema e Invitar Equipo</p>
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}