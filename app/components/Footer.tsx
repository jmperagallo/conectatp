"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "24px", marginTop: "auto" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", fontWeight: 500, flexWrap: "wrap", gap: "16px" }}>
        
        {/* Izquierda: Información Institucional */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <p style={{ margin: 0 }}>
            {/* AQUÍ ESTÁ EL CAMBIO SOLICITADO: "Conecta TP" */}
            &copy; {new Date().getFullYear()} Conecta TP. Conectando la Educación Técnica con el futuro de Chile.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Privacidad</a>
            <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Términos</a>
          </div>
        </div>

        {/* Derecha: Créditos Personales con Enlace a tu LinkedIn */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f5f9", padding: "8px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <span style={{ color: "#475569" }}>Proyecto impulsado por:</span>
          <a 
            href="https://www.linkedin.com/in/jmpaing" // 👈 CAMBIA ESTO POR EL ENLACE REAL DE TU PERFIL
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: "#0077b5", // Color oficial corporativo de LinkedIn
              fontWeight: 700, 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            José Miguel Peragallo Arias
            <svg style={{ width: "14px", height: "14px", fill: "currentColor" }} viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}