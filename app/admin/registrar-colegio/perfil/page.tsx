"use client";

import React, { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { School, ClipboardList, Mail, ShieldAlert, Plus, X } from "lucide-react";
import Header from "@/app/components/Header";

const COLORES = {
  azul: "#1a365d",
  naranja: "#f97316",
  fondo: "#f8fafc",
  borde: "#e2e8f0",
  texto: "#1e293b",
  grisClaro: "#64748b"
};

export default function AdministrarColegios() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Estados del Formulario (Liceo)
  const [rbd, setRbd] = useState("");
  const [nombre, setNombre] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [dependencia, setDependencia] = useState("Servicio Local (SLEP)");

  // Estados para la gestión de correos (Lista Blanca)
  const [correoInput, setCorreoInput] = useState("");
  const [listaCorreos, setListaCorreos] = useState<string[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Agregar correo al listado temporal (Evita burbujeo del formulario)
  const handleAgregarCorreo = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const email = correoInput.trim().toLowerCase();
    if (!email) return;
    
    if (listaCorreos.includes(email)) {
      alert("Este correo ya está en la lista por registrar.");
      return;
    }
    setListaCorreos([...listaCorreos, email]);
    setCorreoInput("");
  };

  // Quitar correo del listado temporal
  const handleQuitarCorreo = (correoAQuitar: string) => {
    setListaCorreos(listaCorreos.filter((c) => c !== correoAQuitar));
  };

  // Guardar en la Base de Datos (VERSIÓN DIAGNÓSTICO EXTREMO)
  const handleRegistrarEcosistema = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rbd.trim() || !nombre.trim()) {
      alert("Por favor, completa los datos obligatorios (RBD y Nombre).");
      return;
    }

    if (listaCorreos.length === 0) {
      alert("Debes añadir al menos un correo con el botón '+ Añadir' antes de registrar.");
      return;
    }

    setSaving(true);
    let liceoId = null;

    try {
      // 1. Intentar insertar o buscar el liceo en la tabla 'liceos'
      const { data: nuevoLiceo, error: errLiceo } = await supabase
        .from("liceos")
        .insert({
          rbd: rbd.trim(),
          nombre: nombre.trim().toUpperCase(),
          comuna: comuna.trim(),
          region: region.trim()
        })
        .select("id")
        .single();

      if (errLiceo) {
        if (errLiceo.code === "23505") {
          const { data: liceoExistente } = await supabase
            .from("liceos")
            .select("id")
            .eq("rbd", rbd.trim())
            .single();
          liceoId = liceoExistente?.id;
        } else {
          throw new Error(`ERROR AL INSERTAR LICEO: ${errLiceo.message}`);
        }
      } else if (nuevoLiceo) {
        liceoId = nuevoLiceo.id;
      }

      if (!liceoId) throw new Error("Fallo crítico: No se pudo obtener o recuperar el ID del establecimiento.");

      // 2. Preparar el arreglo de objetos para la lista blanca
      const payloadsListaBlanca = listaCorreos.map((correo) => ({
        correo: correo,
        rol: "institucion", // Asegúrate de que coincida con tu tipo ENUM de Postgres
        id_liceo: liceoId
      }));

      // 3. Forzar inserción y capturar la respuesta explícita
      const respuestaSupabase = await supabase
        .from("lista_blanca")
        .insert(payloadsListaBlanca)
        .select();

      // 4. Ventana de análisis en caliente
      if (respuestaSupabase.error) {
        alert(
          `🚨 FALLO DETECTADO EN SUPABASE 🚨\n\n` +
          `Código Postgres: ${respuestaSupabase.error.code}\n` +
          `Mensaje: ${respuestaSupabase.error.message}\n` +
          `Detalles técnicos: ${respuestaSupabase.error.details || "Ninguno"}\n\n` +
          `💡 Nota: Si el error menciona un "invalid input value for enum", debes revisar cómo escribiste el rol.`
        );
      } else {
        alert(
          `✅ ¡ÉXITO TOTAL EN LA BASE DE DATOS! ✅\n\n` +
          `Se registraron correctamente los datos en 'lista_blanca'.\n` +
          `Respuesta devuelta: ${JSON.stringify(respuestaSupabase.data, null, 2)}`
        );
        
        // Limpiar formulario tras el éxito confirmado
        setRbd("");
        setNombre("");
        setComuna("");
        setRegion("");
        setListaCorreos([]);
        
        router.push("/dashboard");
      }

    } catch (error: any) {
      alert(`💥 ERROR EXCEPCIONAL DEL CÓDIGO:\n${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <form onSubmit={handleRegistrarEcosistema} style={{ width: "100%", maxWidth: "750px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "20px", border: "1px solid #ffedd5", display: "flex", gap: "14px", alignItems: "center" }}>
            <ShieldAlert size={24} color={COLORES.naranja} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "14px", color: "#9a3412", margin: 0, lineHeight: "1.4" }}>
              <strong>Panel Super Root Inteligente:</strong> Si ingresas un RBD existente, el sistema recuperará su enlace para asociar los correos sin generar errores de duplicidad.
            </p>
          </div>

          {/* Sección 1: Datos del Establecimiento */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <School size={18} color={COLORES.naranja} /> 1. Datos del Establecimiento
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>RBD Mineduc *</label>
                  <input type="text" required placeholder="Ej: 9421" style={inputStyle} value={rbd} onChange={(e) => setRbd(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Nombre del Establecimiento *</label>
                  <input type="text" required placeholder="Ej: LICEO POLITECNICO" style={inputStyle} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Comuna</label>
                  <input type="text" placeholder="Ej: Arica" style={inputStyle} value={comuna} onChange={(e) => setComuna(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Región</label>
                  <input type="text" placeholder="Ej: AYP" style={inputStyle} value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Dependencia administrativa</label>
                <select style={inputStyle} value={dependencia} onChange={(e) => setDependencia(e.target.value)}>
                  <option>Servicio Local (SLEP)</option>
                  <option>Municipal</option>
                  <option>Particular Subvencionado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 2: Administradores */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <Mail size={18} color={COLORES.naranja} /> 2. Administradores del Establecimiento
            </h2>
            <p style={{ fontSize: "13px", color: COLORES.grisClaro, margin: "0 0 20px 0" }}>
              Escribe el correo y presiona obligatoriamente el botón <strong>+ Añadir</strong> para listarlo en la cola de registro.
            </p>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <input 
                type="email" 
                placeholder="Ej: director@liceo.cl" 
                style={inputStyle} 
                value={correoInput} 
                onChange={(e) => setCorreoInput(e.target.value)}
              />
              <button 
                type="button" 
                onClick={handleAgregarCorreo} 
                style={{ backgroundColor: "#c2410c", color: "white", border: "none", padding: "0 24px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Plus size={16} /> Añadir
              </button>
            </div>

            {/* Visualizador de correos en cola por registrar */}
            <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "20px", border: `1px solid ${COLORES.borde}` }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: COLORES.grisClaro, display: "block", marginBottom: "12px" }}>
                CORREOS EN COLA ({listaCorreos.length}):
              </span>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {listaCorreos.length === 0 ? (
                  <span style={{ fontSize: "13px", color: COLORES.grisClaro, fontStyle: "italic" }}>No has añadido correos todavía.</span>
                ) : (
                  listaCorreos.map((correo) => (
                    <div key={correo} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "white", padding: "6px 12px", borderRadius: "20px", border: `1px solid ${COLORES.borde}`, fontSize: "13px", color: COLORES.texto }}>
                      {correo}
                      <X size={14} color="#ef4444" style={{ cursor: "pointer" }} onClick={() => handleQuitarCorreo(correo)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <button 
            type="submit" 
            disabled={saving} 
            style={{ 
              backgroundColor: COLORES.azul, color: "white", border: "none", padding: "18px", borderRadius: "14px", fontSize: "16px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
            }}
          >
            <ClipboardList size={20} />
            {saving ? "Registrando Ecosistema..." : "Registrar Establecimiento e Invitar Equipo"}
          </button>

        </form>
      </main>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: "13px", fontWeight: 700, color: COLORES.texto, display: "block", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", border: `1px solid ${COLORES.borde}`, borderRadius: "10px", fontSize: "14px", backgroundColor: "white", outline: "none", color: COLORES.texto, boxSizing: "border-box" };