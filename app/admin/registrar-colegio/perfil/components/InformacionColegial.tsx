// app/admin/registrar-colegio/perfil/components/InformacionColegial.tsx
import { School, Upload, Image as ImageIcon, MapPin } from "lucide-react";
import { COLORES, labelStyle, inputStyle } from "../styles";
import { useRef } from "react";

interface Props {
  previewLogo: string | null;
  uploadingLogo: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  decretoCooperador: string;
  setDecretoCooperador: (v: string) => void;
  telefonoFijo: string;
  setTelefonoFijo: (v: string) => void;
  telefonoMovilColegio: string;
  handleTelefonoColegioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tieneWhatsapp: boolean;
  setTieneWhatsapp: (v: boolean) => void;
  direccionPostal: string;
  setDireccionPostal: (v: string) => void;
  nombreDirector: string;
  setNombreDirector: (v: string) => void;
  correoDirector: string;
  setCorreoDirector: (v: string) => void;
  mision: string;
  setMision: (v: string) => void;
  vision: string;
  setVision: (v: string) => void;
}

export default function InformacionColegial({
  previewLogo, uploadingLogo, handleFileChange,
  decretoCooperador, setDecretoCooperador,
  telefonoFijo, setTelefonoFijo,
  telefonoMovilColegio, handleTelefonoColegioChange,
  tieneWhatsapp, setTieneWhatsapp,
  direccionPostal, setDireccionPostal,
  nombreDirector, setNombreDirector,
  correoDirector, setCorreoDirector,
  mision, setMision,
  vision, setVision
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px", border: `1px solid ${COLORES.borde}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORES.azul, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
        <School size={18} color={COLORES.naranja} /> 3. Información Colegial
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "center", background: "#f8fafc", padding: "20px", borderRadius: "16px", border: `1px dashed ${COLORES.borde}` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "130px", backgroundColor: "white", borderRadius: "12px", border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
            {previewLogo ? <img src={previewLogo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: COLORES.grisClaro }}><ImageIcon size={32} style={{ opacity: 0.5 }} /><span style={{ fontSize: "11px" }}>Sin Insignia</span></div>}
          </div>
          <div>
            <label style={labelStyle}>Insignia / Logo</label>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            <div onClick={() => fileInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: `2px dashed ${COLORES.naranja}`, borderRadius: "12px", backgroundColor: "#fffbfa", cursor: "pointer" }}>
              <Upload size={22} color={COLORES.naranja} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: COLORES.azul }}>{uploadingLogo ? "Subiendo..." : "Haz clic para cargar imagen"}</span>
            </div>
          </div>
        </div>
        <div><label style={labelStyle}>Decreto Cooperador</label><input type="text" style={inputStyle} value={decretoCooperador} onChange={(e) => setDecretoCooperador(e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={labelStyle}>Teléfono Fijo</label><input type="text" style={inputStyle} value={telefonoFijo} onChange={(e) => setTelefonoFijo(e.target.value)} /></div>
          <div><label style={labelStyle}>Teléfono Móvil</label><div style={{ display: "flex", gap: "12px", alignItems: "center" }}><input type="text" style={{ ...inputStyle, flex: 2 }} value={telefonoMovilColegio} onChange={handleTelefonoColegioChange} /><label style={{ display: "flex", alignItems: "center", gap: "6px" }}><input type="checkbox" checked={tieneWhatsapp} onChange={(e) => setTieneWhatsapp(e.target.checked)} /> WhatsApp</label></div></div>
        </div>
        <div><label style={labelStyle}>Dirección Postal</label><div style={{ position: "relative" }}><MapPin size={16} style={{ position: "absolute", left: "12px", top: "14px", color: COLORES.grisClaro }} /><input type="text" style={{ ...inputStyle, paddingLeft: "36px" }} value={direccionPostal} onChange={(e) => setDireccionPostal(e.target.value)} /></div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: `1px dashed ${COLORES.borde}`, paddingTop: "16px" }}>
          <div><label style={labelStyle}>Director(a)</label><input type="text" style={inputStyle} value={nombreDirector} onChange={(e) => setNombreDirector(e.target.value)} /></div>
          <div><label style={labelStyle}>Correo Director</label><input type="email" style={inputStyle} value={correoDirector} onChange={(e) => setCorreoDirector(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={labelStyle}>Misión</label><textarea style={{ ...inputStyle, height: "100px", resize: "none" }} value={mision} onChange={(e) => setMision(e.target.value)} /></div>
          <div><label style={labelStyle}>Visión</label><textarea style={{ ...inputStyle, height: "100px", resize: "none" }} value={vision} onChange={(e) => setVision(e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}