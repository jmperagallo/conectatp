"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Play, Volume2, Maximize } from "lucide-react";

export default function Hero() {
  return (
    <section style={{ 
      width: "100%", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "80px 24px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      gap: "60px",
      flexWrap: "wrap" 
    }}>
      
      {/* LADO IZQUIERDO: TEXTO Y ACCIÓN */}
      <div style={{ flex: "1 1 540px", textAlign: "left", paddingRight: "20px" }}>
        
        {/* LOGOTIPO / ESLOGAN VISUAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ 
            width: "100%",
            maxWidth: "600px", 
            marginBottom: "30px", 
          }}
        >
          <motion.img 
            src="/logo_conecta_talento_hero.png" 
            alt="Conecta tu talento • Construye tu futuro"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </motion.div>

        {/* DESCRIPCIÓN ESTRATÉGICA ACTUALIZADA */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            fontSize: "18px", 
            color: "#475569", 
            lineHeight: "1.7", 
            marginBottom: "36px", 
            maxWidth: "540px",
            fontWeight: 500
          }}
        >
          La plataforma que une el Talento de la Enseñanza Técnico Profesional con las Empresas, creando oportunidades de Crecimiento, Experiencia y Proyección Profesional y Académica.
        </motion.p>

        {/* BOTONES DE ACCIÓN */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
        >
          {/* Botón Estudiante (Naranja) */}
          <button style={{ 
            backgroundColor: "#f97316", 
            color: "white", 
            padding: "16px 32px", 
            borderRadius: "16px", 
            fontSize: "15px", 
            fontWeight: 800, 
            border: "none", 
            boxShadow: "0 4px 0 #c2410c", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <GraduationCap size={22} />
            Soy Estudiante, iniciar mi ruta
          </button>

          {/* Botón Empresa / Institución (Azul) */}
          <button style={{ 
            backgroundColor: "#2563eb", 
            color: "white", 
            padding: "16px 32px", 
            borderRadius: "16px", 
            fontSize: "15px", 
            fontWeight: 800, 
            border: "none", 
            boxShadow: "0 4px 0 #1d4ed8", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <Briefcase size={20} />
            Acceso Empresas e Instituciones
          </button>
        </motion.div>
      </div>

      {/* LADO DERECHO: REPRODUCTOR DE VIDEO-CURRÍCULUM */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ flex: "1 1 400px", position: "relative", display: "flex", justifyContent: "center" }}
      >
        {/* Aura de fondo difuminada */}
        <div style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#dbeafe", borderRadius: "50%", filter: "blur(60px)", zIndex: -1, opacity: 0.6 }}></div>
        
        {/* Contenedor del Reproductor Falso */}
        <div style={{ 
          width: "100%", 
          maxWidth: "420px", 
          borderRadius: "24px", 
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
          border: "8px solid white", 
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          
          <div style={{ 
            width: "100%", 
            height: "220px", 
            backgroundColor: "#0f172a", 
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
            
            <div style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.15)", 
              backdropFilter: "blur(4px)",
              padding: "20px", 
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}>
              <Play fill="white" color="white" size={32} style={{ marginLeft: "4px" }} />
            </div>

            <div style={{ position: "absolute", bottom: 0, width: "100%", padding: "12px 16px", backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "2px", marginBottom: "8px" }}>
                <div style={{ width: "35%", height: "100%", backgroundColor: "#f97316", borderRadius: "2px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255,255,255,0.8)", fontSize: "12px", fontWeight: 500 }}>
                <span>0:21 / 1:00 min</span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Volume2 size={16} />
                  <Maximize size={16} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "20px", color: "white", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#4ade80", borderRadius: "50%" }}></div>
              <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, letterSpacing: "1px", textTransform: "uppercase", color: "#93c5fd" }}>Ejemplo de Perfil</p>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0" }}>Video-Currículum</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0 }}>Especialidad: Mecánica Automotriz</p>
          </div>

        </div>
      </motion.div>

    </section>
  );
}