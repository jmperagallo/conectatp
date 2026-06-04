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
  especialidadesData: any;
}

export default function MatrizJefes(props: Props) {
  const {
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
  } = props;

  const onSelectChange = (valor: string) => {
    setJefeSelectorCompleto(valor);
    if (!valor) {
      setJefeSector("");
      setJefeEspecialidad("");
      setJefeMencion("");
      return;
    }
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

  const opcionesSelector = () => {
    const opts = [];
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
        <Briefcase size={18} color={COLORES.naranja} /> 4. Matriz de Jefes de Especialidad
      </h2>
      <p style={{ fontSize: "13px", color: COLORES.grisClaro, margin: "0 0 20px 0" }}>
        Asigna el área técnica oficial del Mineduc.
      </p>

      {/* Formulario */}
      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: `1px solid ${COLORES.borde}`, marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.25fr 1.25fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Nombres *</label>
            <input type="text" style={inputStyle} value={jefeNombre} onChange={e => setJefeNombre(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Apellido Paterno *</label>
            <input type="text" style={inputStyle} value={jefeApPaterno} onChange={e => setJefeApPaterno(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Apellido Materno *</label>
            <input type="text" style={inputStyle} value={jefeApMaterno} onChange={e => setJefeApMaterno(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={labelStyle}>Especialidad / Mención *</label>
            <select style={inputStyle} value={jefeSelectorCompleto} onChange={e => onSelectChange(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {opcionesSelector()}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Correo Jefe *</label>
            <input type="email" style={inputStyle} value={jefeCorreo} onChange={e => setJefeCorreo(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={handleAgregarJefe} style={{ backgroundColor: COLORES.azul, color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto", border: `1px solid ${COLORES.borde}`, borderRadius: "12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: `1px solid ${COLORES.borde}` }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre Completo</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Especialidad / Mención</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Correo Electrónico</th>
              <th style={{ padding: "12px 16px", width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {listaJefes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: COLORES.grisClaro }}>Ningún jefe registrado todavía.</td>
              </tr>
            ) : (
              listaJefes.map(j => (
                <tr key={j.correo} style={{ borderBottom: `1px solid ${COLORES.borde}` }}>
                  <td style={{ padding: "12px 16px" }}>{j.nombre} {j.apPaterno} {j.apMaterno}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <strong>{j.especialidad}</strong><br />
                    <small>{j.mencion}</small>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{j.correo}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {j.correo !== correoPrincipal && (
                      <button type="button" onClick={() => handleQuitarJefe(j.correo)} style={{ border: "none", background: "none", cursor: "pointer", color: "#ef4444" }}>
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