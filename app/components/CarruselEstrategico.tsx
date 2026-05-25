"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Continuidad de Estudios",
    subtitle: "El puente digital hacia la Educación Superior",
    description: "Mapeamos y convalidamos tus competencias del liceo técnico directamente con CFT e IPs. Tu esfuerzo en la enseñanza media acelera tu carrera profesional.",
    imageSrc: "https://vertebralchile.cl/wp-content/uploads/2017/10/educacion_tecnica_inacap.jpg",
    color: "#f97316",
    bg: "#fff7ed",
    studentText: "Inicia tu ruta CFT/IP",
    companyText: "Convenios CFT/IP"
  },
  {
    title: "Trazabilidad Real",
    subtitle: "La ruta no termina con un título",
    description: "Generamos analítica avanzada para medir la inserción laboral y la pertinencia de las especialidades. Acompañamos a los egresados en su trayectoria de por vida.",
    imageSrc: "https://static.coupler.io/templates/web-analytics-dashboard-template.png",
    color: "#2563eb",
    bg: "#eff6ff",
    studentText: "Tu trayectoria TP",
    companyText: "Reportes MINEDUC"
  },
  {
    title: "Sector Productivo",
    subtitle: "Sincroniza tu industria con el talento de Chile",
    description: "Optimiza tu reclutamiento con perfiles multimedia verificados y rúbricas alineadas con el MINEDUC. Encuentra hoy al especialista que tu empresa necesita.",
    imageSrc: "https://www.poderyliderazgo.cl/wp-content/uploads/2025/06/MANUFACTURA_BIOBIO_TIERRAPYL-1200-x-700-px.png",
    color: "#0f172a",
    bg: "#f1f5f9",
    studentText: "Ofertas de Práctica",
    companyText: "Reclutamiento TP"
  },
  {
    title: "Innovación Digital",
    subtitle: "La evolución de la educación técnica es conectada",
    description: "Creamos la infraestructura de datos que impulsa el desarrollo del país. Una solución escalable para liceos, sostenedores y redes Futuro Técnico.",
    imageSrc: "https://conecta.tec.mx/sites/default/files/styles/header_full/public/2022-05/dante-delgado-cohete-aeroespacial-3.webp?itok=UCEQm-2W",
    color: "#ea580c",
    bg: "#fff7ed",
    studentText: "Plataforma Liceos",
    companyText: "Red Sostenedores"
  }
];

export default function CarruselEstrategico() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, []);

  // Seguro contra errores de índice en recargas de Next.js
  const currentSlide = slides[index] || slides[0];

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{
              backgroundColor: "white",
              borderRadius: "32px",
              padding: "50px",
              display: "flex",
              alignItems: "center",
              gap: "50px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0",
              flexWrap: "wrap",
              overflow: "hidden",
              position: "relative" 
            }}
          >
            {/* ESLOGAN SUTIL INTEGRADO */}
            <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "#fffbeb", padding: "8px 16px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #fef3c7" }}>
              <span role="img" aria-label="Rocket" style={{ fontSize: "16px" }}>🚀</span>
              <p style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>Conecta tu talento • Construye tu futuro</p>
            </div>

            {/* LADO IZQUIERDO: CONTENEDOR DE IMAGEN */}
            <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <div style={{ width: "100%", maxWidth: "320px", height: "220px", borderRadius: "24px", backgroundColor: currentSlide.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}>
                <img src={currentSlide.imageSrc} alt={currentSlide.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>

            {/* LADO DERECHO: TEXTO + ACCIÓN */}
            <div style={{ flex: "2 1 400px", paddingBottom: "30px", marginTop: "20px" }}> 
              <span style={{ color: currentSlide.color, fontWeight: 700, fontSize: "14px", textTransform: "uppercase" }}>{currentSlide.title}</span>
              <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: "10px 0" }}>{currentSlide.subtitle}</h2>
              <p style={{ fontSize: "17px", color: "#64748b", lineHeight: "1.6", marginBottom: "24px" }}>{currentSlide.description}</p>
              
              {/* Botones de Acción Internos */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button style={{ backgroundColor: "#f97316", color: "white", padding: "12px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 0 #c2410c" }}>
                  {currentSlide.studentText}
                </button>
                <button style={{ backgroundColor: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 0 #1d4ed8" }}>
                  {currentSlide.companyText}
                </button>
              </div>
            </div>

            {/* NAVEGACIÓN INTEGRADA Y SUTIL */}
            <div style={{ position: "absolute", bottom: "20px", left: "0", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", color: "#94a3b8" }}>
              <ChevronLeft size={20} onClick={prev} style={{ cursor: "pointer", transition: "all 0.2s" }} />
              
              <div style={{ display: "flex", gap: "8px" }}>
                {slides.map((_, i) => (
                  <div key={i} style={{ 
                    width: i === index ? "24px" : "8px", 
                    height: "8px", 
                    borderRadius: "10px", 
                    backgroundColor: i === index ? currentSlide.color : "#cbd5e1",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  }} />
                ))}
              </div>

              <ChevronRight size={20} onClick={next} style={{ cursor: "pointer", transition: "all 0.2s" }} />
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}