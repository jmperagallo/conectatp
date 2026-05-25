"use client";

import React, { useState, useRef } from "react";
import { Upload, Plus, Trash2, Save, Mail, School, ShieldCheck } from "lucide-react";
import Header from "@/app/components/Header";
import { SECTORES_TP } from "@/app/lib/especialidades";

const COLORES = {
  azul: "#1a365d",
  naranja: "#f97316",
  fondo: "#f8fafc",
  borde: "#e2e8f0",
  texto: "#1e293b",
  grisClaro: "#64748b"
};

interface Encargado {
  id: string;
  nombre: string;
  correo: string;
  especialidad: string;
}

export default function PerfilColegioPage() {
  // Simulamos datos que ya vienen del Paso 1 (RBD)
  const [datosMineduc] = useState({
    rbd: "9421",
    nombre: "Liceo Bicentenario Técnico Profesional Industrial",
    comuna: "La Calera",
    region: "Valparaíso"
  });

  // Campos adicionales que el Admin debe completar
  const [telefono, setTelefono] = useState("");
  const [web, setWeb] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lista dinámica de Jefes de Especialidad / Encargados de Práctica
  const [encargados, setEncargados] = useState<Encargado[]>([
    { id: "1", nombre: "", correo: "", especialidad: "" }
  ]);

  // Manejo de la subida del logo (Previsualización local)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(URL.createObjectURL(file));
    }
  };

  // Agregar un nuevo encargado a la lista
  const agregarEncargado = () => {
    const nuevo: Encargado = {
      id: Date.now().toString(),
      nombre: "",
      correo: "",
      especialidad: ""
    };
    setEncargados([...encargados, nuevo]);
  };

  // Eliminar un encargado de la lista
  const eliminarEncargado = (id: string) => {
    if (encargados.length === 1) return; // Al menos debe quedar uno
    setEncargados(encargados.filter(enc => enc.id !== id));
  };

  // Actualizar los campos de un encargado específico
  const actualizarEncargado = (id: string, campo: keyof Encargado, valor: string) => {
    setEncargados(encargados.map(enc => enc.id === id ? { ...enc, [campo]: valor } : enc));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de la Institución:", { telefono, web, logo });
    console.log("Equipo de Especialidades:", encargados);
    alert("🚀 Perfil institucional guardado. Se han enviado las invitaciones por correo a los Jefes de Especialidad.");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* CABECERA DE BIENVENIDA (Usuario autenticado por Gmail) */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ backgroundColor: "#eff6ff", padding: "15px", borderRadius: "16px", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORES.azul, boxSizing: "border-box" }}>
              <School size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: COLORES.naranja, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} /> Administrador de Plataforma Verificado
              </span>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: COLORES.texto, margin: "4px 0 0 0" }}>{datosMineduc.nombre}</h1>
              <p style={{ fontSize: "14px", color: COLORES.grisClaro, margin: "2px 0 0 0" }}>RBD {datosMineduc.rbd} • {datosMineduc.comuna}, Región de {datosMineduc.region}</p>
            </div>
          </div>

          {/* SECCIÓN 1: DETALLES INSTITUCIONALES Y LOGO */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 10px 25px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", backgroundColor: COLORES.naranja, borderRadius: "50%" }}></div>
              1. Información Complementaria y Logo
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", alignItems: "center" }}>
              
              {/* SUBIDA DEL LOGO INTERACTIVO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", justifyContent: "center", border: `2px dashed ${COLORES.borde}`, borderRadius: "20px", padding: "20px", height: "160px", cursor: "pointer", backgroundColor: "#fafafa", boxSizing: "border-box" }} onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" style={{ display: "none" }} />
                {logo ? (
                  <img src={logo} alt="Logo preview" style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain", borderRadius: "10px" }} />
                ) : (
                  <>
                    <Upload size={28} color={COLORES.grisClaro} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: COLORES.texto }}>Subir Logo Institucional</span>
                    <span style={{ fontSize: "11px", color: COLORES.grisClaro }}>Formatos PNG o JPG (Máx 2MB)</span>
                  </>
                )}
              </div>

              {/* CAMPOS DE TEXTO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 600, color: COLORES.texto }}>Teléfono de Contacto</label>
                  <input type="tel" required placeholder="Ej: +56 9 1234 5678" style={inputStyle} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 600, color: COLORES.texto }}>Sitio Web Oficial (Opcional)</label>
                  <input type="url" placeholder="Ej: www.tucolegio.cl" style={inputStyle} value={web} onChange={(e) => setWeb(e.target.value)} />
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN 2: REGISTRO DINÁMICO DE JEFES DE ESPECIALIDAD */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 10px 25px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", backgroundColor: COLORES.naranja, borderRadius: "50%" }}></div>
                2. Configurar Jefes de Especialidad / Prácticas
              </h2>
              <button type="button" onClick={agregarEncargado} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#eff6ff", color: COLORES.azul, border: "none", padding: "8px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                <Plus size={16} /> Agregar Especialidad
              </button>
            </div>
            
            <p style={{ fontSize: "14px", color: COLORES.grisClaro, margin: "0 0 10px 0", lineHeight: "1.5" }}>
              Registra a los docentes o profesionales líderes de cada rama técnica. Al guardar, recibirán las instrucciones para cargar sus planillas de alumnos listos para hacer la práctica.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {encargados.map((encargado) => (
                <div key={encargado.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) 45px", gap: "12px", alignItems: "flex-end", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={subLabelStyle}>Nombre del Encargado</label>
                    <input type="text" required placeholder="Ej: Juan Pérez" style={inputStyle} value={encargado.nombre} onChange={(e) => actualizarEncargado(encargado.id, "nombre", e.target.value)} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={subLabelStyle}>Correo Institucional</label>
                    <input type="email" required placeholder="juan.perez@liceo.cl" style={inputStyle} value={encargado.correo} onChange={(e) => actualizarEncargado(encargado.id, "correo", e.target.value)} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={subLabelStyle}>Especialidad / Mención TP</label>
                    <select 
                      required 
                      style={{ ...inputStyle, appearance: "none" }} 
                      value={encargado.especialidad} 
                      onChange={(e) => actualizarEncargado(encargado.id, "especialidad", e.target.value)}
                    >
                      <option value="">Seleccione especialidad...</option>
                      {SECTORES_TP.map((sector) => (
                        <optgroup key={sector.id} label={sector.sector}>
                          {sector.especialidades.map((esp) => (
                            <option key={esp.id} value={esp.id}>
                              {esp.nombre}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* BOTÓN ELIMINAR FILA */}
                  <button type="button" onClick={() => eliminarEncargado(encargado.id)} disabled={encargados.length === 1} style={{ height: "42px", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: encargados.length === 1 ? "#cbd5e1" : "#ef4444", cursor: encargados.length === 1 ? "not-allowed" : "pointer", boxSizing: "border-box" }}>
                    <Trash2 size={18} />
                  </button>

                </div>
              ))}
            </div>
          </div>

          {/* BOTÓN FINAL DE REACCIÓN EN CADENA */}
          <button type="submit" style={{ backgroundColor: COLORES.azul, color: "white", border: "none", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(26, 54, 93, 0.15)", marginTop: "10px" }}>
            <Mail size={20} /> Guardar Perfil y Enviar Invitaciones al Equipo
          </button>

        </form>
      </main>
    </div>
  );
}

// Estilos limpios reutilizables
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: `1px solid ${COLORES.borde}`,
  borderRadius: "10px",
  fontSize: "14px",
  backgroundColor: "white",
  outline: "none",
  color: COLORES.texto,
  boxSizing: "border-box"
};

const subLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: COLORES.grisClaro
};