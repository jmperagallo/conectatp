"use client";

import React from "react";

export default function Header() {
  return (
    <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Contenedor del Logo optimizado y más grande */}
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <img 
            src="/logo Rectangular.png" 
            alt="Logo Prácticas TP" 
            style={{ height: "60px", width: "auto", objectFit: "contain" }} 
          />
        </div>
        
        {/* Menú de Navegación */}
        <div style={{ display: "flex", gap: "24px", fontSize: "14px", fontWeight: 600 }}>
          <a href="#estudiantes" style={{ color: "#64748b", textDecoration: "none" }}>Estudiantes</a>
          <a href="#empresas" style={{ color: "#64748b", textDecoration: "none" }}>Empresas</a>
          <a href="#liceos" style={{ color: "#64748b", textDecoration: "none" }}>Liceos</a>
        </div>

        <button style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#1e3a8a", fontSize: "13px", fontWeight: 700, padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}>
          Iniciar Sesión
        </button>
      </div>
    </nav>
  );
}