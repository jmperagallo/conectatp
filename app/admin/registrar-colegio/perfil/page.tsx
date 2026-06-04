"use client"; // Forzando redeploy

import React, { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { School, ClipboardList, ShieldAlert, Plus, X, User, MapPin, Upload, Image as ImageIcon, Briefcase, Loader2 } from "lucide-react";
import Header from "@/app/components/Header";
import { useR2Upload } from "@/hooks/useR2Upload";

const COLORES = {
  azul: "#1a365d",
  naranja: "#f97316",
  fondo: "#f8fafc",
  borde: "#e2e8f0",
  texto: "#1e293b",
  grisClaro: "#64748b"
};

const MAPA_REGIONES: { [key: string]: string } = {
  "AYP": "Arica y Parinacota",
  "TAP": "Tarapacá",
  "ANTOF": "Antofagasta",
  "ATACAMA": "Atacama",
  "COQUIMBO": "Coquimbo",
  "VALPO": "Valparaíso",
  "RM": "Metropolitana de Santiago",
  "OHIGGINS": "O'Higgins",
  "MAULE": "Maule",
  "NUBLE": "Ñuble",
  "BIOBIO": "Bío Bío",
  "ARAUCANIA": "La Araucanía",
  "LOSRIOS": "Los Ríos",
  "LOSLAGOS": "Los Lagos",
  "AYSEN": "Aysén del G. Carlos Ibáñez del Campo",
  "MAGALLANES": "Magallanes y de la Antártica Chilena"
};

const ESTRUCTURA_TP_CHILE: {
  [sector: string]: {
    [especialidad: string]: string[];
  };
} = {
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
  const [isEditing, setIsEditing] = useState(false);
  const [liceoId, setLiceoId] = useState<string | null>(null);

  // SECCIÓN 1: Establecimiento
  const [rbd, setRbd] = useState("");
  const [nombre, setNombre] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [dependencia, setDependencia] = useState("Servicio Local (SLEP)");

  // SECCIÓN 2: Encargado / Coordinador TP
  const [encargadoNombres, setEncargadoNombres] = useState("");
  const [encargadoApPaterno, setEncargadoApPaterno] = useState("");
  const [encargadoApMaterno, setEncargadoApMaterno] = useState("");
  const [encargadoRut, setEncargadoRut] = useState("");
  const [correoPrincipal, setCorreoPrincipal] = useState(""); 
  const [correoRespaldo, setCorreoRespaldo] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("+56 9 ");

  // SECCIÓN 3: Información Colegial
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

  // SECCIÓN 4: Estados Estructurados para el Jefe de Especialidad
  const [jefeNombre, setJefeNombre] = useState("");
  const [jefeApPaterno, setJefeApPaterno] = useState("");
  const [jefeApMaterno, setJefeApMaterno] = useState("");
  const [jefeSelectorCompleto, setJefeSelectorCompleto] = useState(""); 
  const [jefeSector, setJefeSector] = useState("");
  const [jefeEspecialidad, setJefeEspecialidad] = useState("");
  const [jefeMencion, setJefeMencion] = useState("");
  const [jefeCorreo, setJefeCorreo] = useState("");
  const [listaJefes, setListaJefes] = useState<JefeEspecialidad[]>([]);

  // Hook para subir a Cloudflare R2
  const { uploadFile: uploadLogo, uploading: uploadingLogo } = useR2Upload({
    folder: "logos",
    maxSizeMB: 2,
    onSuccess: (url) => {
      setLogoUrl(url);
      setPreviewLogo(url);
      console.log("✅ Logo subido a R2:", url);
    },
    onError: (error) => {
      console.error("Error subiendo logo:", error);
      alert(`No se pudo subir el logo: ${error}`);
    }
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  // handleFileChange modificado para subir directamente a R2
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onloadend = () => setPreviewLogo(reader.result as string);
    reader.readAsDataURL(file);
    
    // Subir a Cloudflare R2
    const url = await uploadLogo(file);
    if (url) {
      setLogoUrl(url);
      setArchivoLogo(file);
    }
  };

  useEffect(() => {
    async function detectarYBuscarLiceo() {
      try {
        setLoadingSesion(true);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
          console.log("No se detectó sesión activa de usuario.");
          setLoadingSesion(false);
          return;
        }

        const correoUsuario = user.email.toLowerCase();

        const { data: usuarioLista, error: errLista } = await supabase
          .from("lista_blanca")
          .select("id_liceo")
          .eq("correo", correoUsuario)
          .single();

        if (errLista || !usuarioLista || !usuarioLista.id_liceo) {
          console.error("El correo no tiene un Liceo vinculado en la Lista Blanca.");
          setLoadingSesion(false);
          return;
        }

        const idEncontrado = usuarioLista.id_liceo;
        setLiceoId(idEncontrado);
        setIsEditing(true);
        
        const { data: liceo, error: errLiceo } = await supabase
          .from("liceos")
          .select("*")
          .eq("id", idEncontrado)
          .single();

        if (liceo && !errLiceo) {
          setRbd(liceo.rbd || "");
          setNombre(liceo.nombre || "");
          setComuna(liceo.comuna || "");
          
          const siglaBaseDatos = liceo.region || "";
          if (MAPA_REGIONES[siglaBaseDatos.toUpperCase()]) {
            setRegion(MAPA_REGIONES[siglaBaseDatos.toUpperCase()]);
          } else {
            setRegion(siglaBaseDatos);
          }

          if (liceo.dependencia) setDependencia(liceo.dependencia);

          setEncargadoNombres(liceo.encargado_nombres || "");
          setEncargadoApPaterno(liceo.encargado_paterno || "");
          setEncargadoApMaterno(liceo.encargado_materno || "");
          setEncargadoRut(liceo.encargado_rut || "");
          setCorreoRespaldo(liceo.correo_respaldo || "");
          if (liceo.telefono_contacto) setTelefonoContacto(liceo.telefono_contacto);

          setLogoUrl(liceo.logo_url || "");
          if (liceo.logo_url) setPreviewLogo(liceo.logo_url);
          setTelefonoFijo(liceo.telefono_fijo || "");
          if (liceo.telefono_movil_colegio) setTelefonoMovilColegio(liceo.telefono_movil_colegio);
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
          .eq("id_liceo", idEncontrado);

        if (jefesBD && !errJefes) {
          const mapeados: JefeEspecialidad[] = jefesBD.map(j => ({
            id: j.id,
            nombre: j.nombre || "",
            apPaterno: j.apellido_paterno || "",
            apMaterno: j.apellido_materno || "",
            sector: j.sector || "General",
            especialidad: j.especialidad || (j.rol === "master" ? "Administración General" : "General"),
            mencion: j.mencion || "No requiere",
            correo: j.correo
          }));
          setListaJefes(mapeados);

          const master = jefesBD.find(j => j.rol === "master") || jefesBD[0];
          if (master) setCorreoPrincipal(master.correo);
        }

      } catch (error) {
        console.error("Error capturando datos por sesión:", error);
      } finally {
        setLoadingSesion(false);
      }
    }

    detectarYBuscarLiceo();
  }, [supabase]);

  const handleAgregarJefe = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = jefeCorreo.trim().toLowerCase();
    
    if (!jefeNombre.trim() || !jefeApPaterno.trim() || !jefeApMaterno.trim() || !jefeSelectorCompleto || !mail) {
      alert("Por favor, completa todos los campos del Jefe de Especialidad.");
      return;
    }

    if (listaJefes.some(j => j.correo === mail)) {
      alert("Este correo electrónico ya se encuentra registrado para un módulo en este liceo.");
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
    if (correoAQuitar === correoPrincipal) {
      alert("No puedes eliminar al Administrador Principal Máster de la nómina.");
      return;
    }
    setListaJefes(listaJefes.filter(j => j.correo !== correoAQuitar));
  };

  const handleRegistrarEcosistema = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 [INICIO] Ejecutando handleRegistrarEcosistema...");

    if (encargadoRut && encargadoRut.length < 11) {
      alert("Por favor, ingresa un RUT válido en formato completo.");
      return;
    }

    if (!liceoId) {
      console.error("❌ [ERROR CRÍTICO] liceoId está vacío o es null. No se puede guardar nada.");
      alert("Error: No se ha detectado el identificador del liceo asociado a tu cuenta.");
      return;
    }

    setSaving(true);

    try {
      // ==========================================
      // PASO 1: SUBIDA DE LOGO - YA NO ES NECESARIO
      // El logo ya se subió en handleFileChange a Cloudflare R2
      // Solo verificamos que tengamos la URL
      // ==========================================
      let urlLogoFinal = logoUrl;
      
      if (archivoLogo && !urlLogoFinal) {
        console.log("⚠️ Logo pendiente de subir, intentando ahora...");
        const url = await uploadLogo(archivoLogo);
        if (url) {
          urlLogoFinal = url;
        } else {
          throw new Error("No se pudo subir el logo a Cloudflare R2");
        }
      }

      console.log("📸 URL final del logo:", urlLogoFinal);


      
      // ==========================================
// PASO 2: ACTUALIZACIÓN DE TABLA 'LICEOS'
// ==========================================
console.log("🔍 [DEBUG] isEditing:", isEditing, "liceoId:", liceoId);

if (liceoId) {
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

  console.log("📝 [SUPABASE] Payload a enviar:", payloadLiceo);

  const { data: updatedData, error: errUpdate } = await supabase
    .from("liceos")
    .update(payloadLiceo)
    .eq("id", liceoId)
    .select();  // 👈 importante: devuelve el registro actualizado

  if (errUpdate) {
    console.error("❌ [SUPABASE ERROR] Falló actualización:", errUpdate);
    throw new Error(`Error en tabla liceos: ${errUpdate.message}`);
  } else {
    console.log("✅ [SUPABASE] Liceo actualizado correctamente:", updatedData);
  }
} else {
  console.warn("⚠️ No hay liceoId, no se puede actualizar la tabla liceos");
}


        // ==========================================
        // PASO 3: LIMPIEZA DE JEFES ANTERIORES
        // ==========================================
        console.log(`🗑️ [SUPABASE] Limpiando lista_blanca para liceo ${liceoId}, exceptuando al máster: ${correoPrincipal}`);
        const { error: errDelete } = await supabase
          .from("lista_blanca")
          .delete()
          .eq("id_liceo", liceoId)
          .neq("correo", correoPrincipal);

        if (errDelete) {
          console.error("❌ [SUPABASE ERROR] Falló el borrado de la nómina antigua:", errDelete);
          throw new Error(`Error limpiando lista_blanca: ${errDelete.message}`);
        }
        console.log("✅ [SUPABASE] Limpieza de lista_blanca ejecutada sin errores.");

        // ==========================================
        // PASO 4: INSERCIÓN DE NUEVOS JEFES
        // ==========================================
        const jefesAInsertar = listaJefes.filter(j => j.correo !== correoPrincipal);
        console.log(`👥 [NÓMINA] Jefes totales en interfaz: ${listaJefes.length}. Jefes nuevos/adicionales a insertar: ${jefesAInsertar.length}`);

        if (jefesAInsertar.length > 0) {
          const payloadsJefes = jefesAInsertar.map(j => ({
              correo: j.correo.trim().toLowerCase(),
              nombre: j.nombre.trim(),
              apellido_paterno: j.apPaterno.trim(),  
              apellido_materno: j.apMaterno.trim(),  
              sector: j.sector,
              especialidad: j.especialidad,
              mencion: j.mencion,
              rol: "profesor",  // ✅ Cambiado de "jefe_especialidad" a "profesor"
              id_liceo: liceoId
            }));

          console.log("📝 [SUPABASE] Enviando lote de inserción masiva a 'lista_blanca':", payloadsJefes);

          const { error: errInsertJefes, data: dataInsertada } = await supabase
            .from("lista_blanca")
            .insert(payloadsJefes)
            .select();

          if (errInsertJefes) {
            console.error("❌ [SUPABASE ERROR] Falló la inserción masiva en 'lista_blanca':", errInsertJefes);
            throw new Error(`Error al insertar la nómina de jefes: ${errInsertJefes.message} (Detalle: ${errInsertJefes.details || 'Ninguno'})`);
          }
          console.log("✅ [SUPABASE] Todos los jefes de especialidad fueron indexados con éxito:", dataInsertada);
        } else {
          console.log("ℹ️ [NÓMINA] No hay jefes adicionales para registrar (Lista vacía o solo está el máster).");
        }
      }

      alert("✅ ¡Ecosistema e Información de Jefes por Especialidad guardada con éxito!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error("💥 [COLAPSO DEL PROCESO] Se detuvo el guardado debido a:", error);
      alert(`💥 Error detectado:\n\n${error.message}`);
    } finally {
      setSaving(false);
      console.log("🏁 [FIN] Proceso de guardado finalizado.");
    }
  };

  const getInputStyle = (disabled: boolean) => ({
    ...inputStyle,
    backgroundColor: disabled ? "#f1f5f9" : "white",
    color: disabled ? "#64748b" : COLORES.texto,
    cursor: disabled ? "not-allowed" : "text",
    border: disabled ? "1px solid #cbd5e1" : `1px solid ${COLORES.borde}`
  });

  if (loadingSesion) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", fontFamily: "system-ui, sans-serif" }}>
        <Loader2 size={40} color={COLORES.azul} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ color: COLORES.grisClaro, fontSize: "15px", fontWeight: "600" }}>Identificando tu establecimiento en ConectaTP...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <form onSubmit={handleRegistrarEcosistema} style={{ width: "100%", maxWidth: "750px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "20px", border: "1px solid #ffedd5", display: "flex", gap: "14px", alignItems: "center" }}>
            <ShieldAlert size={24} color={COLORES.naranja} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "14px", color: "#9a3412", margin: 0, lineHeight: "1.4" }}>
              <strong>Ecosistema de Seguridad ConectaTP:</strong> Los datos clave del liceo y su cuenta máster están blindados. Puedes registrar credenciales alternativas y configurar a tu equipo de coordinación a continuación.
            </p>
          </div>

          <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "20px", border: "1px solid #dbeafe", display: "flex", gap: "14px", alignItems: "center" }}>
            <ClipboardList size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "14px", color: "#1e40af", margin: 0, lineHeight: "1.4" }}>
              <strong>Ficha del Establecimiento:</strong> Completa detalladamente la visión técnica del establecimiento. Toda esta información nutrirá el portafolio automatizado que verán las empresas aliadas de la red.
            </p>
          </div>

          {/* 1. Datos del Establecimiento */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <School size={18} color={COLORES.naranja} /> 1. Datos del Establecimiento
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>RBD Mineduc</label>
                  <input type="text" style={getInputStyle(true)} value={rbd} disabled />
                </div>
                <div>
                  <label style={labelStyle}>Nombre del Establecimiento</label>
                  <input type="text" style={getInputStyle(true)} value={nombre} disabled />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Comuna</label>
                  <input type="text" style={getInputStyle(true)} value={comuna} disabled />
                </div>
                <div>
                  <label style={labelStyle}>Región</label>
                  <input type="text" style={getInputStyle(true)} value={region} disabled />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Datos del Encargado / Coordinador TP */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <User size={18} color={COLORES.naranja} /> 2. Datos del Encargado / Coordinador TP
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Nombres *</label>
                  <input type="text" required placeholder="Ej: Juan Carlos" style={inputStyle} value={encargadoNombres} onChange={(e) => setEncargadoNombres(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido Paterno *</label>
                  <input type="text" required placeholder="Ej: Pérez" style={inputStyle} value={encargadoApPaterno} onChange={(e) => setEncargadoApPaterno(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido Materno *</label>
                  <input type="text" required placeholder="Ej: Galdames" style={inputStyle} value={encargadoApMaterno} onChange={(e) => setEncargadoApMaterno(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>RUT Encargado * (xx.xxx.xxx-x)</label>
                  <input type="text" required maxLength={12} placeholder="Ej: 12.345.678-K" style={inputStyle} value={encargadoRut} onChange={(e) => setEncargadoRut(formatRut(e.target.value))} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono de Contacto Móvil *</label>
                  <input type="text" required placeholder="+56 9 XXXX XXXX" style={inputStyle} value={telefonoContacto} onChange={handleTelefonoChange} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Correo Electrónico Principal (🔒 Bloqueado)</label>
                  <input type="text" style={getInputStyle(true)} value={correoPrincipal || "Detectando cuenta..."} disabled />
                </div>
                <div>
                  <label style={labelStyle}>Correo Electrónico de Respaldo</label>
                  <input type="email" placeholder="Ej: cuenta.alternativa@liceo.cl" style={inputStyle} value={correoRespaldo} onChange={(e) => setCorreoRespaldo(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Información Colegial */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <School size={18} color={COLORES.naranja} /> 3. Información Colegial
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "center", background: "#f8fafc", padding: "20px", borderRadius: "16px", border: `1px dashed ${COLORES.borde}` }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "130px", backgroundColor: "white", borderRadius: "12px", border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
                  {previewLogo ? (
                    <img src={previewLogo} alt="Insignia Colegio" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: COLORES.grisClaro }}>
                      <ImageIcon size={32} style={{ opacity: 0.5, marginBottom: "4px" }} />
                      <span style={{ fontSize: "11px" }}>Sin Insignia</span>
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Insignia / Logo Oficial del Establecimiento</label>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  <div onClick={() => fileInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: `2px dashed ${COLORES.naranja}`, borderRadius: "12px", backgroundColor: "#fffbfa", cursor: "pointer" }}>
                    <Upload size={22} color={COLORES.naranja} style={{ marginBottom: "6px" }} />
                    <span style={{ fontSize: "13px", fontWeight: "700", color: COLORES.azul }}>
                      {uploadingLogo ? "Subiendo logo..." : "Haz clic para cargar imagen"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Decreto Cooperador / Res. Exenta Mineduc</label>
                <input type="text" placeholder="Ej: Decreto N° 4250 / 1998" style={inputStyle} value={decretoCooperador} onChange={(e) => setDecretoCooperador(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Teléfono de Red Fija</label>
                  <input type="text" placeholder="Ej: +56 58 222 XXXX" style={inputStyle} value={telefonoFijo} onChange={(e) => setTelefonoFijo(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono Móvil del Establecimiento</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input type="text" placeholder="+56 9 XXXX XXXX" style={{ ...inputStyle, flex: 2 }} value={telefonoMovilColegio} onChange={handleTelefonoColegioChange} />
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: COLORES.texto, cursor: "pointer", userSelect: "none" }}>
                      <input type="checkbox" checked={tieneWhatsapp} onChange={(e) => setTieneWhatsapp(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#16a34a" }} />
                      ¿WhatsApp?
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Dirección Postal</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} color={COLORES.grisClaro} style={{ position: "absolute", left: "12px", top: "14px" }} />
                  <input type="text" placeholder="Ej: Avenida Diego Portales #1230" style={{ ...inputStyle, paddingLeft: "36px" }} value={direccionPostal} onChange={(e) => setDireccionPostal(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: `1px dashed ${COLORES.borde}`, paddingTop: "16px" }}>
                <div>
                  <label style={labelStyle}>Nombre de el/la Director(a)</label>
                  <input type="text" placeholder="Ej: Marta Silva Fuentealba" style={inputStyle} value={nombreDirector} onChange={(e) => setNombreDirector(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Correo de el/la Director(a)</label>
                  <input type="email" placeholder="Ej: direccion@liceo.cl" style={inputStyle} value={correoDirector} onChange={(e) => setCorreoDirector(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Misión Institucional</label>
                  <textarea placeholder="Describe el sello educativo..." style={{ ...inputStyle, height: "100px", resize: "none" }} value={mision} onChange={(e) => setMision(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Visión Institucional</label>
                  <textarea placeholder="Describe la proyección a futuro..." style={{ ...inputStyle, height: "100px", resize: "none" }} value={vision} onChange={(e) => setVision(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Matriz de Jefes de Especialidad */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <Briefcase size={18} color={COLORES.naranja} /> 4. Matriz de Jefes de Especialidad (Nexo Estudiantil)
            </h2>
            <p style={{ fontSize: "13px", color: COLORES.grisClaro, margin: "0 0 20px 0" }}>
              Asigna el área técnica oficial del Mineduc para cada encargado de especialidad o mención del establecimiento.
            </p>
            
            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: `1px solid ${COLORES.borde}`, display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.25fr 1.25fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Nombres *</label>
                  <input type="text" placeholder="Ej: Carlos Alberto" style={inputStyle} value={jefeNombre} onChange={(e) => setJefeNombre(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido Paterno *</label>
                  <input type="text" placeholder="Ej: Retamales" style={inputStyle} value={jefeApPaterno} onChange={(e) => setJefeApPaterno(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido Materno *</label>
                  <input type="text" placeholder="Ej: Vega" style={inputStyle} value={jefeApMaterno} onChange={(e) => setJefeApMaterno(e.target.value)} />
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Seleccione Especialidad / Mención Oficial *</label>
                  <select 
                    style={inputStyle} 
                    value={jefeSelectorCompleto} 
                    onChange={(e) => {
                      const valor = e.target.value;
                      setJefeSelectorCompleto(valor);
                      
                      if (!valor) {
                        setJefeSector("");
                        setJefeEspecialidad("");
                        setJefeMencion("");
                        return;
                      }

                      for (const sector in ESTRUCTURA_TP_CHILE) {
                        for (const especialidad in ESTRUCTURA_TP_CHILE[sector]) {
                          const menciones = ESTRUCTURA_TP_CHILE[sector][especialidad];
                          
                          if (menciones.length === 0 && valor === especialidad) {
                            setJefeSector(sector);
                            setJefeEspecialidad(especialidad);
                            setJefeMencion("No requiere");
                            return;
                          }
                          
                          const mencioneEncontrada = menciones.find(m => `${especialidad} - ${m}` === valor);
                          if (mencioneEncontrada) {
                            setJefeSector(sector);
                            setJefeEspecialidad(especialidad);
                            setJefeMencion(mencioneEncontrada);
                            return;
                          }
                        }
                      }
                    }}
                  >
                    <option value="">-- Selecciona Especialidad --</option>
                    {Object.keys(ESTRUCTURA_TP_CHILE).map((sector) => (
                      <optgroup key={sector} label={sector}>
                        {Object.keys(ESTRUCTURA_TP_CHILE[sector]).map((especialidad) => {
                          const menciones = ESTRUCTURA_TP_CHILE[sector][especialidad];
                          if (menciones.length === 0) {
                            return (
                              <option key={especialidad} value={especialidad}>
                                {especialidad}
                              </option>
                            );
                          }
                          return menciones.map((mencion) => (
                            <option key={`${especialidad}-${mencion}`} value={`${especialidad} - ${mencion}`}>
                              {especialidad} ({mencion})
                            </option>
                          ));
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Correo Institucional Jefe *</label>
                  <input type="email" placeholder="Ej: jefe.informatica@liceo.cl" style={inputStyle} value={jefeCorreo} onChange={(e) => setJefeCorreo(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button type="button" onClick={handleAgregarJefe} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: COLORES.azul, color: "white", border: "none", padding: "10px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  <Plus size={16} /> Agregar Técnico a la Lista
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto", border: `1px solid ${COLORES.borde}`, borderRadius: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: `1px solid ${COLORES.borde}`, color: COLORES.grisClaro }}>
                    <th style={{ padding: "12px 16px" }}>Nombre Completo</th>
                    <th style={{ padding: "12px 16px" }}>Especialidad / Mención</th>
                    <th style={{ padding: "12px 16px" }}>Correo Electrónico</th>
                    <th style={{ padding: "12px 16px", width: "60px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {listaJefes.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: COLORES.grisClaro, fontStyle: "italic" }}>
                        Ningún jefe de especialidad asociado todavía.
                      </td>
                    </tr>
                  ) : (
                    listaJefes.map((j) => (
                      <tr key={j.correo} style={{ borderBottom: `1px solid ${COLORES.borde}`, color: COLORES.texto }}>
                        <td style={{ padding: "12px 16px", fontWeight: "500" }}>{`${j.nombre} ${j.apPaterno} ${j.apMaterno}`}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "block", fontWeight: "600", fontSize: "12px", color: COLORES.azul }}>{j.especialidad}</span>
                          <span style={{ fontSize: "11px", color: COLORES.grisClaro }}>{j.mencion}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>{j.correo}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {j.correo !== correoPrincipal && (
                            <button type="button" onClick={() => handleQuitarJefe(j.correo)} style={{ border: "none", background: "none", padding: 4, cursor: "pointer", color: "#ef4444" }}>
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: COLORES.naranja,
                color: "white",
                border: "none",
                padding: "14px 28px",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? "Guardando cambios institucionales..." : "Guardar Ecosistema Completo"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: COLORES.texto,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: `1px solid ${COLORES.borde}`,
  fontSize: "14px",
  color: COLORES.texto,
  backgroundColor: "white",
  outline: "none",
  transition: "border-color 0.2s ease"
};