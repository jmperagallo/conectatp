// app/admin/registrar-colegio/perfil/components/DatosEncargado.tsx
import { User } from "lucide-react";
import { COLORES, labelStyle, inputStyle } from "../styles";

interface Props {
  encargadoNombres: string;
  setEncargadoNombres: (v: string) => void;
  encargadoApPaterno: string;
  setEncargadoApPaterno: (v: string) => void;
  encargadoApMaterno: string;
  setEncargadoApMaterno: (v: string) => void;
  encargadoRut: string;
  setEncargadoRut: (v: string) => void;
  telefonoContacto: string;
  setTelefonoContacto: (v: string) => void;
  correoPrincipal: string;
  correoRespaldo: string;
  setCorreoRespaldo: (v: string) => void;
  formatRut: (value: string) => string;
  handleTelefonoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatosEncargado({
  encargadoNombres, setEncargadoNombres,
  encargadoApPaterno, setEncargadoApPaterno,
  encargadoApMaterno, setEncargadoApMaterno,
  encargadoRut, setEncargadoRut,
  telefonoContacto, setTelefonoContacto,
  correoPrincipal,
  correoRespaldo, setCorreoRespaldo,
  formatRut,
  handleTelefonoChange
}: Props) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
        <User size={18} color={COLORES.naranja} /> 2. Datos del Encargado / Coordinador TP
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr", gap: "16px" }}>
          <div><label style={labelStyle}>Nombres *</label><input type="text" required placeholder="Ej: Juan Carlos" style={inputStyle} value={encargadoNombres} onChange={(e) => setEncargadoNombres(e.target.value)} /></div>
          <div><label style={labelStyle}>Apellido Paterno *</label><input type="text" required placeholder="Ej: Pérez" style={inputStyle} value={encargadoApPaterno} onChange={(e) => setEncargadoApPaterno(e.target.value)} /></div>
          <div><label style={labelStyle}>Apellido Materno *</label><input type="text" required placeholder="Ej: Galdames" style={inputStyle} value={encargadoApMaterno} onChange={(e) => setEncargadoApMaterno(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={labelStyle}>RUT Encargado * (xx.xxx.xxx-x)</label><input type="text" required maxLength={12} placeholder="Ej: 12.345.678-K" style={inputStyle} value={encargadoRut} onChange={(e) => setEncargadoRut(formatRut(e.target.value))} /></div>
          <div><label style={labelStyle}>Teléfono de Contacto Móvil *</label><input type="text" required placeholder="+56 9 XXXX XXXX" style={inputStyle} value={telefonoContacto} onChange={handleTelefonoChange} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={labelStyle}>Correo Electrónico Principal (🔒 Bloqueado)</label><input type="text" style={{ ...inputStyle, backgroundColor: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }} value={correoPrincipal || "No detectado"} disabled /></div>
          <div><label style={labelStyle}>Correo Electrónico de Respaldo</label><input type="email" placeholder="Ej: cuenta.alternativa@liceo.cl" style={inputStyle} value={correoRespaldo} onChange={(e) => setCorreoRespaldo(e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}