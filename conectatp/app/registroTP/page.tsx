"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { School, ArrowRight, ArrowLeft, Mail, Lock, User, CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function RegistroLiceo() {
  const [paso, setPaso] = useState(1);
  const [rbd, setRbd] = useState("");
  const [buscandoRbd, setBuscandoRbd] = useState(false);
  const [liceoEncontrado, setLiceoEncontrado] = useState<any>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombreAdmin: "",
    emailAdmin: "",
    password: "",
  });

  // Especialidades seleccionadas y sus jefes encargados
  const [especialidades, setEspecialidades] = useState<Array<{ nombre: string; jefeEmail: string }>>([
    { nombre: "Mecánica Automotriz", jefeEmail: "" }
  ]);

  // Lista maestra simulada del MINEDUC para el ejemplo técnico
  const simularBusquedaRbd = () => {
    if (!rbd) return;
    setBuscandoRbd(true);
    
    setTimeout(() => {
      // Simulación de respuesta de API del MINEDUC
      setLiceoEncontrado({
        nombre: "Liceo Industrial Bicentenaria Almirante Pedro Espina Ritchie",
        comuna: "Talcahuano",
        region: "Región del Bío Bío",
        dependencia: "Servicio Local de Educación Andalién Sur"
      });
      setBuscandoRbd(false);
    }, 1200);
  };

  const agregarEspecialidad = () => {
    setEspecialidades([...especialidades, { nombre: "", jefeEmail: "" }]);
  };

  const eliminarEspecialidad = (index: number) => {
    setEspecialidades(especialidades.filter((_, i) => i !== index));
  };

  const actualizarEspecialidad = (index: number, campo: 'nombre' | 'jefeEmail', valor: string) => {
    const nuevas = [...especialidades];
    nuevas[index][campo] = valor;
    setEspecialidades(nuevas);
  };

  const listaEspecialidadesOficiales = [
    "Mecánica Automotriz",
    "Electricidad",
    "Electrónica",
    "Programación",
    "Conectividad y Redes",
    "Administración mención Recursos Humanos",
    "Gastronomía",
    "Construcciones Metálicas"
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "640px", backgroundColor: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)", padding: "40px", position: "relative", overflow: "hidden" }}>
        
        {/* Barra de Progreso Superior */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          <div style={{ flex: 1, height: "6px", backgroundColor: paso >= 1 ? "#2563eb" : "#e2e8f0", borderRadius: "3px", transition: "background-color 0.3s" }} />
          <div style={{ flex: 1, height: "6px", backgroundColor: paso >= 2 ? "#2563eb" : "#e2e8f0", borderRadius: "3px", transition: "background-color 0.3s" }} />
        </div>

        <AnimatePresence mode="wait">
          {paso === 1 && (
            <motion.div
              key="paso1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "10px", borderRadius: "12px" }}>
                  <School size={24} />
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>Vincular Establecimiento</h1>
              </div>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "32px", lineHeight: "1.5" }}>
                Ingresa el Rol Base de Datos (RBD) de tu liceo para verificarlo en los registros oficiales del Ministerio de Educación.
              </p>

              {/* Input RBD */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>RBD del Establecimiento</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input 
                    type="number" 
                    placeholder="Ej: 2499"
                    value={rbd}
                    onChange={(e) => setRbd(e.target.value)}
                    style={{ flex: 1, padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none" }}
                  />
                  <button 
                    onClick={simularBusquedaRbd}
                    disabled={buscandoRbd || !rbd}
                    style={{ backgroundColor: "#0f172a", color: "white", padding: "14px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", opacity: !rbd ? 0.6 : 1 }}
                  >
                    {buscandoRbd ? "Buscando..." : "Buscar Liceo"}
                  </button>
                </div>
              </div>

              {/* Resultado del Mineduc Autocompletado */}
              {liceoEncontrado && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", color: "#16a34a", marginBottom: "8px" }}>
                    <CheckCircle2 size={20} style={{ shrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase" }}>Establecimiento Identificado</span>
                  </div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 800, color: "#1e293b", lineHeight: "1.4" }}>{liceoEncontrado.nombre}</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>
                    {liceoEncontrado.comuna}, {liceoEncontrado.region} • <span style={{ fontWeight: 600 }}>{liceoEncontrado.dependencia}</span>
                  </p>
                </motion.div>
              )}

              {/* Botón Siguiente */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
                <button 
                  onClick={() => setPaso(2)}
                  disabled={!liceoEncontrado}
                  style={{ 
                    backgroundColor: "#2563eb", 
                    color: "white", 
                    padding: "14px 28px", 
                    borderRadius: "12px", 
                    fontSize: "15px", 
                    fontWeight: 700, 
                    border: "none", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: !liceoEncontrado ? 0.5 : 1
                  }}
                >
                  Continuar configuración <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {paso === 2 && (
            <motion.div
              key="paso2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Especialidades y Encargados</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "32px" }}>
                Configura las especialidades técnico-profesionales que imparte tu liceo y asigna los correos de los profesores coordinadores.
              </p>

              {/* Mapeo Dinámico de Especialidades */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "320px", overflowY: "auto", paddingRight: "4px", marginBottom: "24px" }}>
                {especialidades.map((esp, index) => (
                  <div key={index} style={{ display: "flex", gap: "12px", alignItems: "center", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    
                    {/* Select Especialidad */}
                    <div style={{ flex: 1 }}>
                      <select
                        value={esp.nombre}
                        onChange={(e) => actualizarEspecialidad(index, 'nombre', e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "white", fontSize: "14px", outline: "none" }}
                      >
                        <option value="">-- Selecciona Especialidad --</option>
                        {listaEspecialidadesOficiales.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* Input Correo Jefe */}
                    <div style={{ flex: 1 }}>
                      <input 
                        type="email" 
                        placeholder="Correo del Jefe de Área"
                        value={esp.jefeEmail}
                        onChange={(e) => actualizarEspecialidad(index, 'jefeEmail', e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
                      />
                    </div>

                    {/* Botón Eliminar Fila */}
                    {especialidades.length > 1 && (
                      <button 
                        onClick={() => eliminarEspecialidad(index)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón Agregar Más Especialidades */}
              <button 
                onClick={agregarEspecialidad}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px dashed #cbd5e1", color: "#475569", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: "32px" }}
              >
                <Plus size={16} /> Agregar otra especialidad TP
              </button>

              {/* Botones de Navegación Final */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                <button 
                  onClick={() => setPaso(1)}
                  style={{ background: "none", color: "#64748b", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 600 }}
                >
                  <ArrowLeft size={18} /> Atrás
                </button>

                <button 
                  onClick={() => alert("¡Liceo Registrado e Invitaciones Enviadas!")}
                  style={{ backgroundColor: "#16a34a", color: "white", padding: "14px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Finalizar Registro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}