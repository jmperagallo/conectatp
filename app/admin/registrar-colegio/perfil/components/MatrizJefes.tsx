// app/admin/registrar-colegio/perfil/components/MatrizJefes.tsx
import { Briefcase, Plus, X } from "lucide-react";
import { COLORES, labelStyle, inputStyle } from "../styles";

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

interface Props {
  listaJefes: JefeEspecialidad[];
  correoPrincipal: string;
  // Campos del formulario de nuevo jefe
  jefeNombre: string;
  setJefeNombre: (v: string) => void;
  jefeApPaterno: string;
  setJefeApPaterno: (v: string) => void;
  jefeApMaterno: string;
  setJefeApMaterno: (v: string) => void;
  jefeSelectorCompleto: string;
  setJefeSelectorCompleto: (v: string) => void;
  setJefeSector: (v: string) => void;
  setJefeEspecialidad: (v: string) => void;
  setJefeMencion: (v: string) => void;
  jefeCorreo: string;
  setJefeCorreo: (v: string) => void;
  handleAgregarJefe: (e: React.FormEvent) => void;
  handleQuitarJefe: (correo: string) => void;
  // Datos de especialidades
  especialidadesData: {
    [sector: string]: {
      [especialidad: string]: string[];
    };
  };
}

export default function MatrizJefes({
  listaJefes,
  correoPrincipal,
  jefeNombre, setJefeNombre,
  jefeApPaterno, setJefeApPaterno,
  jefeApMaterno, setJefeApMaterno,
  jefeSelectorCompleto, setJefeSelectorCompleto,
  setJefeSector, setJefeEspecialidad, setJefeMencion,
  jefeCorreo, setJefeCorreo,
  handleAgregarJefe,
  handleQuitarJefe,
  especialidadesData
}: Props) {
  // Manejo del cambio en el selector
  const onSelectChange = (valor: string) => {
    setJefeSelectorCompleto(valor);
    if (!valor) {
      setJefeSector("");
      setJefeEspecialidad("");
      setJefeMencion("");
      return;
    }
    // Buscar coincidencia en la estructura de especialidades
    for (const sector in especialidadesData) {
      for (const especialidad in especialidadesData[sector]) {
        const menciones = especialidadesData[sector][especialidad];
        if (menciones.length === 0 && valor === especialidad) {
          setJefeSector(sector);
          setJefeEspecialidad(especialidad);
          setJefeMencion("No requiere");
          return;
        }
        const encontrada = menciones.find(m => `${especialidad} - ${m}` === valor);
        if (encontrada) {
          setJefeSector(sector);
          setJefeEspecialidad(especialidad);
          setJefeMencion(encontrada);
          return;
        }
      }
    }
  };

  // Generar opciones del selector
  const opcionesSelector = () => {
    const opts: JSX.Element[] = [];
    for (const sector in especialidadesData) {
      const group = [];
      for (const especialidad in especialidadesData[sector]) {
        const menciones = especialidadesData[sector][especialidad];
        if (menciones.length === 0) {
          group.push(<option key={especialidad} value={especialidad}>{especialidad}</option>);
        } else {
          for (const mencion of menciones) {
            const valor = `${especialidad} - ${mencion}`;
            group.push(<option key={valor} value={valor}>{especialidad} ({mencion})</option>);
          }
        }
      }
      opts.push(<optgroup key={sector} label={sector}>{group}</optgroup>);
    }
    return opts;
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
        <Briefcase size={18} color={COLORES.naranja} /> 4. Matriz de Jefes de Especialidad (Nexo Estudiantil)
      </h2>
      <p style={{ fontSize: "13px", color: COLORES.grisClaro, margin: "0 0 20px 0" }}>
        Asigna el área técnica oficial del Mineduc para cada encargado de especialidad o mención del establecimiento.
      </p>

      {/* Formulario para agregar nuevo jefe */}
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
            <select style={inputStyle} value={jefeSelectorCompleto} onChange={(e) => onSelectChange(e.target.value)}>
              <option value="">-- Selecciona Especialidad --</option>
              {opcionesSelector()}
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

      {/* Tabla de jefes registrados */}
      <div style={{ overflowX: "auto", border: `1px solid ${COLORES.borde}`, borderRadius: "12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: `1px solid ${COLORES.borde}`, color: COLORES.grisClaro }}>
              <th style={{ padding: "12px 16px" }}>Nombre Completo</th>
              <th style={{ padding: "12px 16px" }}>Especialidad / Mención</th>
              <th style={{ padding: "12px 16px" }}>Correo Electrónico</th>
              <th style={{ padding: "12px 16px", width: "60px" }}></th>
            </table>
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
  );
}