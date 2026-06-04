"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ShieldAlert, ClipboardList } from "lucide-react";
import Header from "@/app/components/Header";
import { useR2Upload } from "@/hooks/useR2Upload";
import { COLORES } from "./styles";
import DatosEstablecimiento from "./components/DatosEstablecimiento";
import DatosEncargado from "./components/DatosEncargado";
import InformacionColegial from "./components/InformacionColegial";
import MatrizJefes from "./components/MatrizJefes";

// ... el resto del código con la lógica

export default function AdministrarColegios() {
  // ... todos los useState y useEffect

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORES.fondo, display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <form onSubmit={handleRegistrarEcosistema} style={{ width: "100%", maxWidth: "750px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* banners */}
          <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "20px", border: "1px solid #ffedd5", display: "flex", gap: "14px", alignItems: "center" }}>
            <ShieldAlert size={24} color={COLORES.naranja} />
            <p style={{ fontSize: "14px", color: "#9a3412", margin: 0 }}><strong>Ecosistema de Seguridad ConectaTP:</strong> Los datos clave del liceo y su cuenta máster están blindados...</p>
          </div>
          <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "20px", border: "1px solid #dbeafe", display: "flex", gap: "14px", alignItems: "center" }}>
            <ClipboardList size={24} color="#3b82f6" />
            <p style={{ fontSize: "14px", color: "#1e40af", margin: 0 }}><strong>Ficha del Establecimiento:</strong> Completa detalladamente la visión técnica...</p>
          </div>

          <DatosEstablecimiento rbd={rbd} nombre={nombre} comuna={comuna} region={region} />
          <DatosEncargado {...propsEncargado} />
          <InformacionColegial {...propsInformacion} />
          <MatrizJefes {...propsJefes} />

          <button type="submit" disabled={saving} style={{ backgroundColor: COLORES.naranja, color: "white", border: "none", padding: "14px 28px", borderRadius: "14px", fontSize: "15px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Guardando..." : "Guardar Ecosistema Completo"}
          </button>
        </form>
      </main>
    </div>
  );
}