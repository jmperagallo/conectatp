"use client";

import React, { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ShieldAlert, ClipboardList, Loader2 } from "lucide-react";
import Header from "@/app/components/Header";
import { useR2Upload } from "@/hooks/useR2Upload";
import { COLORES } from "./styles";
import DatosEstablecimiento from "./components/DatosEstablecimiento";
import DatosEncargado from "./components/DatosEncargado";
import InformacionColegial from "./components/InformacionColegial";
import MatrizJefes from "./components/MatrizJefes";

// ============================================================
// ESTRUCTURA TP CHILE (copia completa de tu objeto original)
// ============================================================
const ESTRUCTURA_TP_CHILE = {
  "Administración y Comercio": {
    "Administración": ["Mención Logística", "Mención Recursos Humanos"],
    "Contabilidad": []
  },
  "Agropecuario": {
    "Agropecuaria": ["Mención Agricultura", "Mención Ganadería", "Mención Vitivinícola"]
  },
  "Alimentación": {
    "Elaboración Industrial de Alimentos": [],
    "Gastronomía": ["Mención Cocina", "Mención Pastelería y Repostería"]
  },
  "Construcción": {
    "Construcción": ["Mención Edificación", "Mención Obras de Vialidad e Infraestructura", "Mención Terminaciones de la Construcción"],
    "Construcciones Metálicas": [],
    "Instalaciones Sanitarias": []
  },
  "Electricidad": {
    "Electricidad": [],
    "Electrónica": []
  },
  "Hotelería y Turismo": {
    "Hotelería": [],
    "Servicios de Turismo": []
  },
  "Marítimo": {
    "Acuicultura": [],
    "Tripulación de Naves Mercantes y Especiales": []
  },
  "Metalmecánico": {
    "Mecánica Automotriz": [],
    "Mecánica Industrial": ["Mención Mantenimiento Electromecánico", "Mención Máquinas-Herramientas", "Mención Matricería"],
    "Refrigeración y Climatización": []
  },
  "Minería": {
    "Explotación Minera": [],
    "Metalurgia Extractiva": [],
    "Asistencia en Geología": []
  },
  "Química": {
    "Operación Planta Química": [],
    "Química Industrial": ["Mención Laboratorio Químico", "Mención Planta Química"]
  },
  "Salud y Educación": {
    "Asistencia de Párvulos": [],
    "Atención de Enfermería": [],
    "Atención Social y Recreativa": []
  },
  "Tecnología y Comunicaciones": {
    "Conectividad y Redes": [],
    "Programación": [],
    "Telecomunicaciones": []
  },
  "Maderero": {
    "Forestal": [],
    "Procesamiento de la Madera": []
  },
  "Gráfico": {
    "Dibujo Técnico": [],
    "Gráfica": []
  },
  "Confección": {
    "Tejido": [],
    "Vestuario y Confección Industrial": []
  }
};

interface JefeEspecialidad {
  id?: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  sector: string;
  especialidad: string;
  mencion: string;
  correo: string;
}

export default function AdministrarColegios() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loadingSesion, setLoadingSesion] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liceoId, setLiceoId] = useState<string | null>(null);
  const [rolUsuario, setRolUsuario] = useState<string | null>(null);

  // DEBUG: logs visibles en pantalla
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addDebugLog = (mensaje: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${mensaje}`, ...prev]);
    console.log(mensaje);
  };

  // Datos del establecimiento
  const [rbd, setRbd] = useState("");
  const [nombre, setNombre] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [dependencia, setDependencia] = useState("Servicio Local (SLEP)");

  // Encargado
  const [encargadoNombres, setEncargadoNombres] = useState("");
  const [encargadoApPaterno, setEncargadoApPaterno] = useState("");
  const [encargadoApMaterno, setEncargadoApMaterno] = useState("");
  const [encargadoRut, setEncargadoRut] = useState("");
  const [correoPrincipal, setCorreoPrincipal] = useState("");
  const [correoRespaldo, setCorreoRespaldo] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("+56 9 ");

  // Información colegial
  const [logoUrl, setLogoUrl] = useState("");
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null);
  const [telefonoFijo, setTelefonoFijo] = useState("");
  const [telefonoMovilColegio, setTelefonoMovilColegio] = useState("+56 9 ");
  const [tieneWhatsapp, setTieneWhatsapp] = useState(false);
  const [direccionPostal, setDireccionPostal] = useState("");
  const [nombreDirector, setNombreDirector] = useState("");
  const [correoDirector, setCorreoDirector] = useState("");
  const [mision, setMision] = useState("");
  const [vision, setVision] = useState("");
  const [decretoCooperador, setDecretoCooperador] = useState("");

  // Jefes
  const [jefeNombre, setJefeNombre] = useState("");
  const [jefeApPaterno, setJefeApPaterno] = useState("");
  const [jefeApMaterno, setJefeApMaterno] = useState("");
  const [jefeSelectorCompleto, setJefeSelectorCompleto] = useState("");
  const [jefeSector, setJefeSector] = useState("");
  const [jefeEspecialidad, setJefeEspecialidad] = useState("");
  const [jefeMencion, setJefeMencion] = useState("");
  const [jefeCorreo, setJefeCorreo] = useState("");
  const [listaJefes, setListaJefes] = useState<JefeEspecialidad[]>([]);

  // Subida a R2
  const { uploadFile: uploadLogo, uploading: uploadingLogo } = useR2Upload({
    folder: "logos",
    maxSizeMB: 2,
    onSuccess: (url) => {
      setLogoUrl(url);
      setPreviewLogo(url);
      addDebugLog(`✅ Logo subido a R2: ${url}`);
    },
    onError: (error) => {
      addDebugLog(`❌ Error subiendo logo: ${error}`);
      alert(`No se pudo subir el logo: ${error}`);
    }
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Funciones auxiliares
  const formatRut = (value: string) => {
    let actual = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (actual.length <= 1) return actual;
    let dv = actual.slice(-1);
    let numerico = actual.slice(0, -1);
    let formateado = "";
    if (numerico.length > 5) {
      formateado = numerico.slice(0, -5) + "." + numerico.slice(-5, -2) + "." + numerico.slice(-2);
    } else if (numerico.length > 2) {
      formateado = numerico.slice(0, -2) + "." + numerico.slice(-2);
    } else {
      formateado = numerico;
    }
    return formateado + "-" + dv;
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input.startsWith("+56 9 ")) { setTelefonoContacto("+56 9 "); return; }
    const numerosSolo = input.slice(6).replace(/\D/g, "");
    const numerosLimitados = numerosSolo.slice(0, 8);
    let formateado = numerosLimitados.length > 4 ? numerosLimitados.slice(0, 4) + " " + numerosLimitados.slice(4) : numerosLimitados;
    setTelefonoContacto("+56 9 " + formateado);
  };

  const handleTelefonoColegioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input.startsWith("+56 9 ")) { setTelefonoMovilColegio("+56 9 "); return; }
    const numerosSolo = input.slice(6).replace(/\D/g, "");
    const numerosLimitados = numerosSolo.slice(0, 8);
    let formateado = numerosLimitados.length > 4 ? numerosLimitados.slice(0, 4) + " " + numerosLimitados.slice(4) : numerosLimitados;
    setTelefonoMovilColegio("+56 9 " + formateado);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addDebugLog(`📸 Archivo seleccionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewLogo(reader.result as string);
    reader.readAsDataURL(file);
    const url = await uploadLogo(file);
    if (url) {
      setLogoUrl(url);
      setArchivoLogo(file);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    async function detectarYBuscarLiceo() {
      try {
        setLoadingSesion(true);
        addDebugLog("🔄 Cargando datos del establecimiento...");
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.email) {
          addDebugLog("❌ No se detectó sesión activa.");
          setLoadingSesion(false);
          return;
        }
        const correoUsuario = user.email.toLowerCase();
        setCorreoPrincipal(correoUsuario);
        addDebugLog(`📧 Usuario autenticado: ${correoUsuario}`);
        const { data: usuarioLista, error: errLista } = await supabase
          .from("lista_blanca")
          .select("id_liceo, rol")
          .eq("correo", correoUsuario)
          .single();
        if (errLista || !usuarioLista || !usuarioLista.id_liceo) {
          addDebugLog("❌ Usuario sin liceo vinculado en lista_blanca.");
          setLoadingSesion(false);
          return;
        }
        const idEncontrado = usuarioLista.id_liceo;
        setLiceoId(idEncontrado);
        setRolUsuario(usuarioLista.rol);
        addDebugLog(`🏫 Liceo ID: ${idEncontrado}, Rol: ${usuarioLista.rol}`);

        const { data: liceo, error: errLiceo } = await supabase
          .from("liceos")
          .select("*")
          .eq("id", idEncontrado)
          .single();
        if (liceo && !errLiceo) {
          setRbd(liceo.rbd || "");
          setNombre(liceo.nombre || "");
          setComuna(liceo.comuna || "");
          setRegion(liceo.region || "");
          // ... (resto de campos)
          addDebugLog(`📋 Datos del liceo cargados: RBD=${liceo.rbd}, Nombre=${liceo.nombre}`);
        } else {
          addDebugLog(`⚠️ No se encontró el liceo con ID ${idEncontrado}`);
        }
        const { data: jefesBD, error: errJefes } = await supabase
          .from("lista_blanca")
          .select("*")
          .eq("id_liceo", idEncontrado)
          .neq("correo", correoUsuario);
        if (jefesBD && !errJefes) {
          setListaJefes(jefesBD.map(j => ({ ... }))); // (tu mapeo)
          addDebugLog(`👥 Jefes cargados: ${jefesBD.length}`);
        }
      } catch (error) {
        addDebugLog(`💥 Error en carga inicial: ${error.message}`);
      } finally {
        setLoadingSesion(false);
      }
    }
    detectarYBuscarLiceo();
  }, []);

  // Manejo de jefes (igual que antes)
  const handleAgregarJefe = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = jefeCorreo.trim().toLowerCase();
    if (!jefeNombre.trim() || !jefeApPaterno.trim() || !jefeApMaterno.trim() || !jefeSelectorCompleto || !mail) {
      alert("Completa todos los campos.");
      return;
    }
    if (listaJefes.some(j => j.correo === mail)) {
      alert("Correo ya registrado.");
      return;
    }
    setListaJefes([...listaJefes, {
      nombre: jefeNombre.trim(),
      apPaterno: jefeApPaterno.trim(),
      apMaterno: jefeApMaterno.trim(),
      sector: jefeSector,
      especialidad: jefeEspecialidad,
      mencion: jefeMencion,
      correo: mail
    }]);
    addDebugLog(`➕ Jefe agregado: ${jefeNombre} ${jefeApPaterno} (${mail})`);
    setJefeNombre(""); setJefeApPaterno(""); setJefeApMaterno("");
    setJefeSelectorCompleto(""); setJefeSector(""); setJefeEspecialidad("");
    setJefeMencion(""); setJefeCorreo("");
  };

  const handleQuitarJefe = (correoAQuitar: string) => {
    if (correoAQuitar === correoPrincipal) {
      alert("No puedes eliminar al Administrador Principal.");
      return;
    }
    setListaJefes(listaJefes.filter(j => j.correo !== correoAQuitar));
    addDebugLog(`➖ Jefe eliminado: ${correoAQuitar}`);
  };

  // Función principal de guardado con logs en pantalla
  const handleRegistrarEcosistema = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog("🚀 INICIO del guardado del ecosistema");
    if (encargadoRut && encargadoRut.length < 11) {
      addDebugLog("❌ RUT inválido");
      alert("Ingresa un RUT válido.");
      return;
    }
    if (rolUsuario !== 'administrador_liceo' && rolUsuario !== 'profesor') {
      addDebugLog(`❌ Permiso denegado. Rol actual: ${rolUsuario}`);
      alert("No tienes permisos para modificar estos datos.");
      return;
    }
    if (!liceoId && !rbd) {
      addDebugLog("❌ No se pudo identificar el establecimiento (liceoId y rbd vacíos)");
      alert("No se pudo identificar el establecimiento.");
      return;
    }
    setSaving(true);
    try {
      let urlLogoFinal = logoUrl;
      if (archivoLogo && !urlLogoFinal) {
        addDebugLog("📤 Subiendo logo a Cloudflare R2...");
        const url = await uploadLogo(archivoLogo);
        if (!url) throw new Error("No se pudo subir el logo");
        urlLogoFinal = url;
        addDebugLog(`✅ Logo subido, URL: ${urlLogoFinal}`);
      }
      const payloadLiceo = {
        encargado_nombres: encargadoNombres.trim(),
        encargado_paterno: encargadoApPaterno.trim(),
        encargado_materno: encargadoApMaterno.trim(),
        encargado_rut: encargadoRut.trim(),
        correo_respaldo: correoRespaldo.trim().toLowerCase(),
        telefono_contacto: telefonoContacto.trim(),
        logo_url: urlLogoFinal,
        telefono_fijo: telefonoFijo.trim(),
        telefono_movil_colegio: telefonoMovilColegio.trim(),
        tiene_whatsapp: tieneWhatsapp,
        direccion_postal: direccionPostal.trim(),
        nombre_director: nombreDirector.trim(),
        correo_director: correoDirector.trim().toLowerCase(),
        mision: mision.trim(),
        vision: vision.trim(),
        decreto_cooperador: decretoCooperador.trim()
      };
      addDebugLog(`🔍 Valores recibidos: liceoId=${liceoId}, rbd=${rbd}, tipo rbd=${typeof rbd}`);
      addDebugLog(`📦 Payload a enviar: ${JSON.stringify(payloadLiceo, null, 2)}`);

      let actualizado = false;
      if (liceoId) {
        addDebugLog(`🟢 Intentando actualizar por ID: ${liceoId}`);
        const { data: updatedById, error: errById } = await supabase
          .from("liceos")
          .update(payloadLiceo)
          .eq("id", liceoId)
          .select();
        if (errById) {
          addDebugLog(`❌ Error actualizando por ID: ${errById.message}`);
          throw new Error(`Error por ID: ${errById.message}`);
        }
        if (updatedById && updatedById.length > 0) {
          addDebugLog(`✅ Actualizado por ID correctamente: ${JSON.stringify(updatedById)}`);
          actualizado = true;
        } else {
          addDebugLog(`⚠️ No se encontró registro con ID: ${liceoId}`);
        }
      }
      if (!actualizado && rbd) {
        addDebugLog(`🟡 Intentando actualizar por RBD: ${rbd}`);
        const { data: updatedByRbd, error: errByRbd } = await supabase
          .from("liceos")
          .update(payloadLiceo)
          .eq("rbd", String(rbd))
          .select();
        if (errByRbd) {
          addDebugLog(`❌ Error actualizando por RBD: ${errByRbd.message}`);
          throw new Error(`Error por RBD: ${errByRbd.message}`);
        }
        if (updatedByRbd && updatedByRbd.length > 0) {
          addDebugLog(`✅ Actualizado por RBD correctamente: ${JSON.stringify(updatedByRbd)}`);
          actualizado = true;
        } else {
          addDebugLog(`⚠️ No se encontró registro con RBD: ${rbd}`);
        }
      }
      if (!actualizado) {
        throw new Error(`No se encontró establecimiento con ID ${liceoId} ni con RBD ${rbd}`);
      }
      const jefesAGuardar = listaJefes.filter(j => j.correo !== correoPrincipal);
      addDebugLog(`👥 Jefes a guardar (upsert): ${jefesAGuardar.length}`);
      if (jefesAGuardar.length > 0) {
        const { error: errUpsert } = await supabase
          .from("lista_blanca")
          .upsert(jefesAGuardar.map(j => ({
            correo: j.correo.trim().toLowerCase(),
            nombre: j.nombre.trim(),
            apellido_paterno: j.apPaterno.trim(),
            apellido_materno: j.apMaterno.trim(),
            sector: j.sector,
            especialidad: j.especialidad,
            mencion: j.mencion,
            rol: "profesor",
            id_liceo: liceoId
          })), { onConflict: 'correo' });
        if (errUpsert) {
          addDebugLog(`❌ Error en upsert de jefes: ${errUpsert.message}`);
          throw new Error(`Error guardando jefes: ${errUpsert.message}`);
        }
        addDebugLog("✅ Jefes guardados correctamente");
      }
      addDebugLog("🎉 ¡TODO GUARDADO CON ÉXITO!");
      alert("✅ ¡Ecosistema guardado con éxito!");
      router.push("/dashboard");
    } catch (error: any) {
      addDebugLog(`💥 ERROR FATAL: ${error.message}`);
      alert(`❌ Error detectado:\n\n${error.message}`);
    } finally {
      setSaving(false);
      addDebugLog("🏁 Proceso finalizado.");
    }
  };

  if (loadingSesion) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <Loader2 size={40} color={COLORES.azul} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ color: COLORES.grisClaro, fontWeight: "600" }}>Identificando tu establecimiento...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <form onSubmit={handleRegistrarEcosistema} style={{ width: "100%", maxWidth: "750px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Alertas informativas */}
          <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px", alignItems: "center" }}>
            <ShieldAlert size={24} color={COLORES.naranja} />
            <p><strong>Ecosistema de Seguridad:</strong> Datos blindados, registra a tu equipo.</p>
          </div>
          <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px", alignItems: "center" }}>
            <ClipboardList size={24} color="#3b82f6" />
            <p><strong>Ficha del Establecimiento:</strong> Información que verán las empresas.</p>
          </div>

          <DatosEstablecimiento rbd={rbd} nombre={nombre} comuna={comuna} region={region} />
          <DatosEncargado
            encargadoNombres={encargadoNombres} setEncargadoNombres={setEncargadoNombres}
            encargadoApPaterno={encargadoApPaterno} setEncargadoApPaterno={setEncargadoApPaterno}
            encargadoApMaterno={encargadoApMaterno} setEncargadoApMaterno={setEncargadoApMaterno}
            encargadoRut={encargadoRut} setEncargadoRut={setEncargadoRut}
            telefonoContacto={telefonoContacto} setTelefonoContacto={setTelefonoContacto}
            correoPrincipal={correoPrincipal}
            correoRespaldo={correoRespaldo} setCorreoRespaldo={setCorreoRespaldo}
            formatRut={formatRut} handleTelefonoChange={handleTelefonoChange}
          />
          <InformacionColegial
            previewLogo={previewLogo} uploadingLogo={uploadingLogo} handleFileChange={handleFileChange}
            decretoCooperador={decretoCooperador} setDecretoCooperador={setDecretoCooperador}
            telefonoFijo={telefonoFijo} setTelefonoFijo={setTelefonoFijo}
            telefonoMovilColegio={telefonoMovilColegio} handleTelefonoColegioChange={handleTelefonoColegioChange}
            tieneWhatsapp={tieneWhatsapp} setTieneWhatsapp={setTieneWhatsapp}
            direccionPostal={direccionPostal} setDireccionPostal={setDireccionPostal}
            nombreDirector={nombreDirector} setNombreDirector={setNombreDirector}
            correoDirector={correoDirector} setCorreoDirector={setCorreoDirector}
            mision={mision} setMision={setMision}
            vision={vision} setVision={setVision}
          />
          <MatrizJefes
            listaJefes={listaJefes}
            correoPrincipal={correoPrincipal}
            jefeNombre={jefeNombre} setJefeNombre={setJefeNombre}
            jefeApPaterno={jefeApPaterno} setJefeApPaterno={setJefeApPaterno}
            jefeApMaterno={jefeApMaterno} setJefeApMaterno={setJefeApMaterno}
            jefeSelectorCompleto={jefeSelectorCompleto} setJefeSelectorCompleto={setJefeSelectorCompleto}
            setJefeSector={setJefeSector} setJefeEspecialidad={setJefeEspecialidad} setJefeMencion={setJefeMencion}
            jefeCorreo={jefeCorreo} setJefeCorreo={setJefeCorreo}
            handleAgregarJefe={handleAgregarJefe}
            handleQuitarJefe={handleQuitarJefe}
            especialidadesData={ESTRUCTURA_TP_CHILE}
          />
          <button type="submit" disabled={saving} style={{ backgroundColor: COLORES.naranja, color: "white", border: "none", padding: "14px 28px", borderRadius: "14px", fontSize: "15px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Guardando cambios institucionales..." : "Guardar Ecosistema Completo"}
          </button>

          {/* PANEL DE DEPURACIÓN VISIBLE */}
          <div style={{ marginTop: "32px", backgroundColor: "#1e1e2e", color: "#f8f8f2", padding: "16px", borderRadius: "12px", fontFamily: "monospace", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong>🐞 LOGS DE DEPURACIÓN (en tiempo real)</strong>
              <div>
                <button onClick={() => navigator.clipboard.writeText(debugLogs.join("\n"))} style={{ marginRight: "8px", background: "#444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>📋 Copiar</button>
                <button onClick={() => setDebugLogs([])} style={{ background: "#444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>🗑️ Limpiar</button>
              </div>
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto", borderTop: "1px solid #444", paddingTop: "8px" }}>
              {debugLogs.length === 0 ? (
                <p style={{ color: "#aaa", fontStyle: "italic" }}>Esperando acciones... (no se han mostrado logs aún)</p>
              ) : (
                debugLogs.map((log, idx) => (
                  <div key={idx} style={{ borderBottom: "1px solid #333", padding: "4px 0", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}