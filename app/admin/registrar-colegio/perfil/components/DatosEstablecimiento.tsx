// app/admin/registrar-colegio/perfil/components/DatosEstablecimiento.tsx
import { School } from "lucide-react";
import { COLORES, labelStyle, inputStyle, getInputStyle } from "../styles";

interface Props {
  rbd: string;
  nombre: string;
  comuna: string;
  region: string;
}

export default function DatosEstablecimiento({ rbd, nombre, comuna, region }: Props) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
        <School size={18} color={COLORES.naranja} /> 1. Datos del Establecimiento
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
          <div><label style={labelStyle}>RBD Mineduc</label><input type="text" style={getInputStyle(true)} value={rbd} disabled /></div>
          <div><label style={labelStyle}>Nombre del Establecimiento</label><input type="text" style={getInputStyle(true)} value={nombre} disabled /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={labelStyle}>Comuna</label><input type="text" style={getInputStyle(true)} value={comuna} disabled /></div>
          <div><label style={labelStyle}>Región</label><input type="text" style={getInputStyle(true)} value={region} disabled /></div>
        </div>
      </div>
    </div>
  );
}