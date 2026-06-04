// app/admin/registrar-colegio/perfil/styles.ts
export const COLORES = {
  azul: "#1a365d",
  naranja: "#f97316",
  fondo: "#f8fafc",
  borde: "#e2e8f0",
  texto: "#1e293b",
  grisClaro: "#64748b"
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: COLORES.texto,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

export const inputStyle: React.CSSProperties = {
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

export const getInputStyle = (disabled: boolean) => ({
  ...inputStyle,
  backgroundColor: disabled ? "#f1f5f9" : "white",
  color: disabled ? "#64748b" : COLORES.texto,
  cursor: disabled ? "not-allowed" : "text",
  border: disabled ? "1px solid #cbd5e1" : `1px solid ${COLORES.borde}`
});