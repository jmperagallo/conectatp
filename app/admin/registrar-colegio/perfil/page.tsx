"use client";

import React, { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ShieldAlert, ClipboardList, Loader2 } from "lucide-react";
import Header from "@/app/components/Header";
import { useR2Upload } from "@/hooks/useR2Upload";
import { COLORES, labelStyle, inputStyle, getInputStyle } from "./styles";
import DatosEstablecimiento from "./components/DatosEstablecimiento";
import DatosEncargado from "./components/DatosEncargado";
import InformacionColegial from "./components/InformacionColegial";
import MatrizJefes from "./components/MatrizJefes";

// ============================================================
// ESTRUCTURA TP CHILE (completa)
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

  // Depuración visual
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const addDebug = (msg: string) => {
    console.log(msg);
    setDebugMessages(prev => [...prev, new Date().toLocaleTimeString() + " - " + msg]);
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

  // Subida a R2 con eliminación automática del logo anterior
  const { uploadFile: uploadLogo, uploading: uploadingLogo } = useR2Upload({
    folder: "logos",
    maxSizeMB: 2,
    onSuccess: async (url) => {
      if (logoUrl && logoUrl !== url) {
        try {
          const oldKey = logoUrl.replace(process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/", "");
          addDebug(`🗑️ Eliminando logo anterior: ${oldKey}`);
          await fetch("/api/r2-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: oldKey })
          });
          addDebug(`✅ Logo anterior eliminado de R2`);
        } catch (err) {
          addDebug(`⚠️ No se pudo eliminar el logo anterior: ${err}`);
        }
      }
      setLogoUrl(url);
      setPreviewLogo(url);
      addDebug(`✅ Logo subido a R2: ${url}`);
    },
    onError: (error) => {
      addDebug(`❌ Error subiendo logo: ${error}`);
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
    const reader = new FileReader();
    reader.onloadend = () => setPreviewLogo(reader.result as string);
    reader.readAsDataURL(file);
    const url = await uploadLogo(file);
    if (url) setArchivoLogo(file);
  };

  // Cargar datos iniciales
  useEffect(() => {
    async function detectarYBuscarLiceo() {
      try {
        setLoadingSesion(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.email) { setLoadingSesion(false); return; }
        const correoUsuario = user.email.toLowerCase();
        setCorreoPrincipal(correoUsuario);
        const { data: usuarioLista, error: errLista } = await supabase
          .from("lista_blanca")
          .select("id_liceo, rol")
          .eq("correo", correoUsuario)
          .single();
        if (errLista || !usuarioLista || !usuarioLista.id_liceo) { setLoadingSesion(false); return; }
        const idEncontrado = usuarioLista.id_liceo;
        setLiceoId(idEncontrado);
        setRolUsuario(usuarioLista.rol);

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
          setEncargadoNombres(liceo.encargado_nombres || "");
          setEncargadoApPaterno(liceo.encargado_paterno || "");
          setEncargadoApMaterno(liceo.encargado_materno || "");
          setEncargadoRut(liceo.encargado_rut || "");
          setCorreoRespaldo(liceo.correo_respaldo || "");
          setTelefonoContacto(liceo.telefono_contacto || "+56 9 ");
          setLogoUrl(liceo.logo_url || "");
          if (liceo.logo_url) setPreviewLogo(liceo.logo_url);
          setTelefonoFijo(liceo.telefono_fijo || "");
          setTelefonoMovilColegio(liceo.telefono_movil_colegio || "+56 9 ");
          setTieneWhatsapp(liceo.tiene_whatsapp || false);
          setDireccionPostal(liceo.direccion_postal || "");
          setNombreDirector(liceo.nombre_director || "");
          setCorreoDirector(liceo.correo_director || "");
          setMision(liceo.mision || "");
          setVision(liceo.vision || "");
          setDecretoCooperador(liceo.decreto_cooperador || "");
        }
        const { data: jefesBD, error: errJefes } = await supabase
          .from("lista_blanca")
          .select("*")
          .eq("id_liceo", idEncontrado)
          .neq("correo", correoUsuario);
        if (jefesBD && !errJefes) {
          const mapeados: JefeEspecialidad[] = jefesBD.map(j => ({
            id: j.id,
            nombre: j.nombre || "",
            apPaterno: j.apellido_paterno || "",
            apMaterno: j.apellido_materno || "",
            sector: j.sector || "General",
            especialidad: j.especialidad || "General",
            mencion: j.mencion || "No requiere",
            correo: j.correo
          }));
          setListaJefes(mapeados);
        }
      } catch (error) { console.error(error); }
      finally { setLoadingSesion(false); }
    }
    detectarYBuscarLiceo();
  }, [supabase]);

  // Manejo de jefes
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
    const nuevoJefe: JefeEspecialidad = {
      nombre: jefeNombre.trim(),
      apPaterno: jefeApPaterno.trim(),
      apMaterno: jefeApMaterno.trim(),
      sector: jefeSector,
      especialidad: jefeEspecialidad,
      mencion: jefeMencion,
      correo: mail
    };
    setListaJefes([...listaJefes, nuevoJefe]);
    setJefeNombre("");
    setJefeApPaterno("");
    setJefeApMaterno("");
    setJefeSelectorCompleto("");
    setJefeSector("");
    setJefeEspecialidad("");
    setJefeMencion("");
    setJefeCorreo("");
  };

  const handleQuitarJefe = (correoAQuitar: string) => {
    if (correoAQuitar === correoPrincipal) return alert("No puedes eliminar al Administrador Principal.");
    setListaJefes(listaJefes.filter(j => j.correo !== correoAQuitar));
  };

  // Guardar todo (con envío de correos a jefes nuevos)
  const handleRegistrarEcosistema = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebug("🚀 Guardando ecosistema...");
    if (encargadoRut && encargadoRut.length < 11) return alert("RUT inválido.");
    if (rolUsuario !== 'administrador_liceo' && rolUsuario !== 'profesor') return alert("Sin permisos.");
    if (!liceoId && !rbd) return alert("No se pudo identificar el establecimiento.");
    setSaving(true);
    try {
      let urlLogoFinal = logoUrl;
      if (archivoLogo && !urlLogoFinal) {
        const url = await uploadLogo(archivoLogo);
        if (!url) throw new Error("No se pudo subir el logo");
        urlLogoFinal = url;
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

      let actualizado = false;
      if (liceoId) {
        const { data, error } = await supabase
          .from("liceos")
          .update(payloadLiceo)
          .eq("id", liceoId)
          .select();
        if (error) throw new Error(`Error por ID: ${error.message}`);
        if (data && data.length > 0) actualizado = true;
      }
      if (!actualizado && rbd) {
        const { data, error } = await supabase
          .from("liceos")
          .update(payloadLiceo)
          .eq("rbd", String(rbd))
          .select();
        if (error) throw new Error(`Error por RBD: ${error.message}`);
        if (data && data.length > 0) actualizado = true;
      }
      if (!actualizado) throw new Error(`No se encontró establecimiento con ID ${liceoId} ni RBD ${rbd}`);

      // Actualizar perfil_completo si el usuario es jefe
      if (rolUsuario === 'profesor' && liceoId) {
        await supabase
          .from("lista_blanca")
          .update({ perfil_completo: true })
          .eq("correo", correoPrincipal);
        addDebug("✅ Perfil de jefe marcado como completo");
      }

      // Guardar jefes (upsert)
      const jefesAGuardar = listaJefes.filter(j => j.correo !== correoPrincipal);
      if (jefesAGuardar.length > 0) {
        const { error } = await supabase
          .from("lista_blanca")
          .upsert(jefesAGuardar.map(j => ({
            correo: j.correo.toLowerCase(),
            nombre: j.nombre,
            apellido_paterno: j.apPaterno,
            apellido_materno: j.apMaterno,
            sector: j.sector,
            especialidad: j.especialidad,
            mencion: j.mencion,
            rol: "profesor",
            id_liceo: liceoId,
            invitacion_enviada: false
          })), { onConflict: 'correo' });
        if (error) throw new Error(`Error guardando jefes: ${error.message}`);
        addDebug(`✅ ${jefesAGuardar.length} jefes guardados (invitación pendiente)`);
      }

      // Envío de correos a jefes pendientes
      const { data: jefesPendientes, error: errPendientes } = await supabase
        .from("lista_blanca")
        .select("correo, nombre, apellido_paterno, especialidad")
        .eq("id_liceo", liceoId)
        .eq("rol", "profesor")
        .eq("invitacion_enviada", false);
      if (!errPendientes && jefesPendientes && jefesPendientes.length > 0) {
        addDebug(`📧 Preparando envío de ${jefesPendientes.length} invitaciones...`);
        for (const jefe of jefesPendientes) {
          const tempPass = `CNX-${Math.floor(1000 + Math.random() * 9000)}-TP`;
          try {
            await fetch("/api/enviar-invitacion-jefe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                correo: jefe.correo,
                nombre: jefe.nombre,
                apellido: jefe.apellido_paterno,
                institucion: nombre,
                especialidad: jefe.especialidad,
                passwordTemporal: tempPass
              })
            });
            await supabase
              .from("lista_blanca")
              .update({ invitacion_enviada: true })
              .eq("correo", jefe.correo);
            addDebug(`📧 Invitación enviada a ${jefe.correo}`);
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (err) {
            addDebug(`❌ Error enviando a ${jefe.correo}: ${err}`);
          }
        }
      } else {
        addDebug("ℹ️ No hay jefes pendientes de invitación.");
      }

      addDebug("🎉 Todo guardado exitosamente");
      alert("✅ ¡Ecosistema guardado con éxito!");
      router.push("/dashboard");
    } catch (error: any) {
      addDebug(`💥 ERROR: ${error.message}`);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const clearDebug = () => setDebugMessages([]);

  if (loadingSesion) {
    return <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={40} color={COLORES.azul} style={{ animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style></div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "850px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Panel de depuración */}
          <div style={{ backgroundColor: "#1e1e2f", color: "#fff", borderRadius: "12px", padding: "12px", fontSize: "12px", fontFamily: "monospace", maxHeight: "200px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong>🐞 DEPURACIÓN EN VIVO</strong>
              <button onClick={clearDebug} style={{ background: "#f97316", border: "none", color: "white", padding: "2px 8px", borderRadius: "4px", cursor: "pointer" }}>Limpiar</button>
            </div>
            {debugMessages.length === 0 && <div>Esperando acciones...</div>}
            {debugMessages.map((msg, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #334", padding: "4px 0", color: msg.includes("✅") ? "#4ade80" : msg.includes("❌") ? "#f87171" : "#ccc" }}>{msg}</div>
            ))}
          </div>

          <form onSubmit={handleRegistrarEcosistema} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px" }}>
              <ShieldAlert size={24} color={COLORES.naranja} />
              <p><strong>Ecosistema de Seguridad:</strong> Datos blindados, registra a tu equipo.</p>
            </div>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px" }}>
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
              {saving ? "Guardando..." : "Guardar Ecosistema Completo"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}