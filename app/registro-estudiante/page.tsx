'use client';

import React, { useState } from 'react';
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
  card: { backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(26, 54, 93, 0.08)', maxWidth: '45rem', width: '100%', padding: '2.5rem 2rem', border: `1px solid ${COLORES.borde}`, position: 'relative' as 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' as 'column', gap: '2rem' },
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
  input: { width: '100%', padding: '0.6rem 0.85rem', border: `1px solid ${COLORES.borde}`, borderRadius: '0.375rem', fontSize: '0.9rem', backgroundColor: 'white', outline: 'none', color: '#1e293b', boxSizing: 'border-box' as 'border-box' },
  textarea: { width: '100%', padding: '0.6rem 0.85rem', border: `1px solid ${COLORES.borde}`, borderRadius: '0.375rem', fontSize: '0.9rem', backgroundColor: 'white', outline: 'none', color: '#1e293b', minHeight: '4.5rem', resize: 'none' as 'none', fontFamily: 'inherit', boxSizing: 'border-box' as 'border-box' },
  select: { appearance: 'none' as 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.1em', paddingRight: '2.5rem' },
  
  // Botones y dinámicos
  button: { width: '100%', backgroundColor: COLORES.azul, color: 'white', fontWeight: 600, fontSize: '0.95rem', padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyInhalt: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' },
  btnSecundario: { padding: '0.4rem 0.75rem', backgroundColor: 'transparent', border: `1px dashed ${COLORES.azul}`, color: COLORES.azul, borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' },
  bloqueDinamico: { backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: `1px solid ${COLORES.borde}`, position: 'relative' as 'relative', display: 'flex', flexDirection: 'column' as 'column', gap: '0.75rem' },
  btnEliminar: { position: 'absolute' as 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 },
  
  containerTarjetas: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  tarjetaObjetivo: (activo: boolean) => ({ padding: '1rem', borderRadius: '0.5rem', border: `2px solid ${activo ? COLORES.naranja : COLORES.borde}`, backgroundColor: activo ? '#fff7ed' : 'white', cursor: 'pointer', textAlign: 'left' as 'left', transition: 'all 0.2s ease', outline: 'none' }),
  tarjetaTitulo: { display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' },
  tarjetaTexto: { display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' },
  exitoContainer: { textAlign: 'center' as 'center', display: 'flex', flexDirection: 'column' as 'column', gap: '1rem', alignItems: 'center' },
  exitoIcono: { width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }
};

export default function RegistroEstudianteCompletoPage() {
  const [nombre, setNombre] = useState('');
  const [comuna, setComuna] = useState('');
  const [correo, setCorreo] = useState('');
  const [titular, setTitular] = useState('');
  const [liceo, setLiceo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Estados para inputs múltiples (Arrays)
  const [experiencias, setExperiencias] = useState([{ puesto: '', empresa: '', descripcion: '' }]);
  const [estudios, setEstudios] = useState([{ institucion: '', curso: '', ano: '' }]);
  const [certificaciones, setCertificaciones] = useState(['']);
  const [pasatiempos, setPasatiempos] = useState(['']);

  // Funciones para manejar bloques dinámicos
  const agregarExperiencia = () => setExperiencias([...experiencias, { puesto: '', empresa: '', descripcion: '' }]);
  const eliminarExperiencia = (index: number) => setExperiencias(experiencias.filter((_, i) => i !== index));
  const actualizarExperiencia = (index: number, campo: string, valor: string) => {
    const nuevas = [...experiencias];
    nuevas[index] = { ...nuevas[index], [campo]: valor };
    setExperiencias(nuevas);
  };

  const agregarEstudio = () => setEstudios([...estudios, { institucion: '', curso: '', ano: '' }]);
  const eliminarEstudio = (index: number) => setEstudios(estudios.filter((_, i) => i !== index));
  const actualizarEstudio = (index: number, campo: string, valor: string) => {
    const nuevos = [...estudios];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setEstudios(nuevos);
  };

  const agregarCertificacion = () => setCertificaciones([...certificaciones, '']);
  const eliminarCertificacion = (index: number) => setCertificaciones(certificaciones.filter((_, i) => i !== index));
  const actualizarCertificacion = (index: number, valor: string) => {
    const nuevas = [...certificaciones];
    nuevas[index] = valor;
    setCertificaciones(nuevas);
  };

  const agregarPasatiempo = () => setPasatiempos([...pasatiempos, '']);
  const eliminarPasatiempo = (index: number) => setPasatiempos(pasatiempos.filter((_, i) => i !== index));
  const actualizarPasatiempo = (index: number, valor: string) => {
    const nuevos = [...pasatiempos];
    nuevos[index] = valor;
    setPasatiempos(nuevos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nombre, comuna, correo, titular, liceo, especialidad, objetivo,
      experiencias, estudios, certificaciones, pasatiempos
    });
    setEnviado(true);
  };

  return (
    <div style={styles.page}>
      <Header />

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.topBar}></div>
          
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Crea tu Currículum Virtual</h1>
            <p style={styles.subtitle}>Completa tu perfil profesional para conectar con empresas y prácticas técnicas.</p>
          </div>

          {!enviado ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              
              {/* SECCIÓN 1: IDENTIFICACIÓN */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>1. Información Personal</h2>
                <div style={styles.gridMd}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nombre Completo</label>
                    <input type="text" required placeholder="Ej: Pedro González" style={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Comuna de residencia</label>
                    <input type="text" required placeholder="Ej: La Florida" style={styles.input} value={comuna} onChange={(e) => setComuna(e.target.value)} />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input type="email" required placeholder="estudiante@correo.cl" style={styles.input} value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Titular Académico / Extracto Breve</label>
                  <textarea required placeholder="Cuéntale al mundo tus metas técnicas. Ej: Estudiante de Telecomunicaciones interesado en redes Cisco y soporte TI." style={styles.textarea} value={titular} onChange={(e) => setTitular(e.target.value)} />
                </div>
              </div>

              {/* SECCIÓN 2: EDUCACIÓN SECUNDARIA */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>2. Educación Técnico Profesional Base</h2>
                <div style={styles.gridMd}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Liceo de Egreso</label>
                    <input type="text" required placeholder="Ej: Liceo Polivalente Gutiérrez" style={styles.input} value={liceo} onChange={(e) => setLiceo(e.target.value)} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Especialidad Media TP</label>
                    <select required style={{...styles.input, ...styles.select}} value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
                      <option value="">Selecciona tu especialidad...</option>
                      <option value="Programación">Programación</option>
                      <option value="Mecánica Industrial">Mecánica Industrial</option>
                      <option value="Electricidad">Electricidad</option>
                      <option value="Administración">Administración</option>
                      <option value="Telecomunicaciones">Telecomunicaciones</option>
                      <option value="Gastronomía">Gastronomía</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: OTROS ESTUDIOS / CURSOS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>3. Otros Estudios o Cursos Superiores</h2>
                {estudios.map((estudio, index) => (
                  <div key={index} style={styles.bloqueDinamico}>
                    {estudios.length > 1 && <button type="button" style={styles.btnEliminar} onClick={() => eliminarEstudio(index)}>Eliminar</button>}
                    <div style={styles.gridMd}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Institución o Academia</label>
                        <input type="text" placeholder="Ej: INACAP, Duoc UC, Coursera" style={styles.input} value={estudio.institucion} onChange={(e) => actualizarEstudio(index, 'institucion', e.target.value)} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Título o Nombre del Curso</label>
                        <input type="text" placeholder="Ej: Técnico en Electrónica / Curso de Python" style={styles.input} value={estudio.curso} onChange={(e) => actualizarEstudio(index, 'curso', e.target.value)} />
                      </div>
                    </div>
                    <div style={{...styles.inputGroup, maxWidth: '200px'}}>
                      <label style={styles.label}>Año de Finalización</label>
                      <input type="text" placeholder="Ej: 2025 / En curso" style={styles.input} value={estudio.ano} onChange={(e) => actualizarEstudio(index, 'ano', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button type="button" style={styles.btnSecundario} onClick={agregarEstudio}>+ Añadir otro estudio</button>
              </div>

              {/* SECCIÓN 4: EXPERIENCIAS LABORALES / PROYECTOS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>4. Experiencia Laboral / Proyectos de Liceo</h2>
                {experiencias.map((exp, index) => (
                  <div key={index} style={styles.bloqueDinamico}>
                    {experiencias.length > 1 && <button type="button" style={styles.btnEliminar} onClick={() => eliminarExperiencia(index)}>Eliminar</button>}
                    <div style={styles.gridMd}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Cargo / Puesto realizado</label>
                        <input type="text" placeholder="Ej: Ayudante Técnico / Práctica Dual" style={styles.input} value={exp.puesto} onChange={(e) => actualizarExperiencia(index, 'puesto', e.target.value)} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Empresa o Proyecto</label>
                        <input type="text" placeholder="Ej: Taller Mecánico Central / Proyecto Escolar Furia" style={styles.input} value={exp.empresa} onChange={(e) => actualizarExperiencia(index, 'empresa', e.target.value)} />
                      </div>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>¿Qué hacías allí? (Descripción breve)</label>
                      <textarea placeholder="Ej: Encargado del mantenimiento de motores y control de inventario de repuestos." style={styles.textarea} value={exp.descripcion} onChange={(e) => actualizarExperiencia(index, 'descripcion', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button type="button" style={styles.btnSecundario} onClick={agregarExperiencia}>+ Añadir otra experiencia</button>
              </div>

              {/* SECCIÓN 5: CERTIFICACIONES */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>5. Certificaciones o Licencias</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {certificaciones.map((cert, index) => (
                    <div key={index} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <input type="text" placeholder="Ej: Certificación CCNA Cisco / Licencia de Conducir Clase B" style={styles.input} value={cert} onChange={(e) => actualizarCertificacion(index, e.target.value)} />
                      {certificaciones.length > 1 && <button type="button" style={{...styles.btnEliminar, position: 'static'}} onClick={() => eliminarCertificacion(index)}>✖</button>}
                    </div>
                  ))}
                </div>
                <button type="button" style={styles.btnSecundario} onClick={agregarCertificacion}>+ Añadir otra certificación</button>
              </div>

              {/* SECCIÓN 6: PASATIEMPOS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>6. Pasatiempos o Intereses</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {pasatiempos.map((hobby, index) => (
                    <div key={index} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <input type="text" placeholder="Ej: Robótica competitiva, Fútbol amateur, Ajedrez, Programación libre" style={styles.input} value={hobby} onChange={(e) => actualizarPasatiempo(index, e.target.value)} />
                      {pasatiempos.length > 1 && <button type="button" style={{...styles.btnEliminar, position: 'static'}} onClick={() => eliminarPasatiempo(index)}>✖</button>}
                    </div>
                  ))}
                </div>
                <button type="button" style={styles.btnSecundario} onClick={agregarPasatiempo}>+ Añadir otro pasatiempo</button>
              </div>

              {/* SECCIÓN 7: OBJETIVOS FUTUROS */}
              <div style={{...styles.section, borderBottom: 'none', paddingBottom: 0}}>
                <h2 style={styles.sectionTitle}><div style={styles.sectionDot}></div>7. ¿Cuál es tu objetivo actual?</h2>
                <div style={styles.containerTarjetas}>
                  <button type="button" style={styles.tarjetaObjetivo(objetivo === 'practica')} onClick={() => setObjetivo('practica')}>
                    <span style={styles.tarjetaTitulo}>💼 Práctica Profesional</span>
                    <span style={styles.tarjetaTexto}>Quiero ingresar directo a una empresa para convalidar mi título medio.</span>
                  </button>
                  <button type="button" style={styles.tarjetaObjetivo(objetivo === 'estudios')} onClick={() => setObjetivo('estudios')}>
                    <span style={styles.tarjetaTitulo}>🎓 Continuar Estudios</span>
                    <span style={styles.tarjetaTexto}>Busco matricularme y articular con un IP, CFT o Universidad.</span>
                  </button>
                </div>
              </div>

              {/* BOTÓN DE ENVÍO */}
              <button type="submit" disabled={!objetivo} style={{...styles.button, opacity: objetivo ? 1 : 0.6, cursor: objetivo ? 'pointer' : 'not-allowed'}}>
                Finalizar y Publicar Currículum
              </button>

            </form>
          ) : (
            /* PANTALLA DE ÉXITO */
            <div style={styles.exitoContainer}>
              <div style={styles.exitoIcono}>✓</div>
              <h2 style={{...styles.title, color: '#15803d'}}>¡Currículum Creado Exitosamente!</h2>
              <p style={styles.subtitle}>
                Tu perfil digital está completo. Los reclutadores de empresas y las instituciones de educación superior ya pueden revisar tu historial de <strong>Conecta TP</strong>.
              </p>
              <button onClick={() => window.location.reload()} style={{...styles.button, maxWidth: '15rem', marginTop: '1rem'}}>
                Editar o Crear otro Perfil
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}