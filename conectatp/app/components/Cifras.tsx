"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Briefcase, School, TrendingUp } from "lucide-react";

// Sub-componente interno para el contador animado
function ContadorAscendente({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const elementoRef = useRef(null);
  const estaEnVista = useInView(elementoRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!estaEnVista) return;

    let tiempoInicio: number | null = null;
    const duracion = 2000; // 2 segundos

    const animar = (tiempoActual: number) => {
      if (!tiempoInicio) tiempoInicio = tiempoActual;
      const progreso = tiempoActual - tiempoInicio;
      
      const porcentaje = Math.min(progreso / duracion, 1);
      const progresoSuave = porcentaje * (2 - porcentaje);
      
      setCount(Math.floor(progresoSuave * target));

      if (porcentaje < 1) {
        requestAnimationFrame(animar);
      }
    };

    requestAnimationFrame(animar);
  }, [estaEnVista, target]);

  return <span ref={elementoRef}>{count.toLocaleString("es-CL")}</span>;
}

export default function Cifras() {
  const stats = [
    {
      id: 1,
      label: "Estudiantes Postulando",
      numericValue: 1000,
      prefix: "+",
      subtext: "Talento joven activo",
      icon: <Users size={28} />,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      id: 2,
      label: "Empresas Buscando",
      numericValue: 500,
      prefix: "+",
      subtext: "Ofertas de práctica hoy",
      icon: <Briefcase size={28} />,
      color: "#f97316",
      bg: "#fff7ed"
    },
    {
      id: 3,
      label: "Instituciones TP",
      numericValue: 100,
      prefix: "+",
      subtext: "Liceos en convenio",
      icon: <School size={28} />,
      color: "#16a34a",
      bg: "#f0fdf4"
    }
  ];

  return (
    <section style={{ width: "100%", backgroundColor: "#ffffff", padding: "80px 24px", borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Grilla de Cifras */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          gap: "32px",
          flexWrap: "wrap"
        }}>
          {stats.map((stat, index) => {
            // Usamos llaves y return explícito para que el compilador no se confunda con los comentarios
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ flex: "1 1 300px" }}
              >
                {/* Animación de Vaivén Infinito */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.4 
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    transition: "box-shadow 0.3s ease"
                  }}
                >
                  {/* Icono con fondo circular */}
                  <div style={{ 
                    backgroundColor: stat.bg, 
                    color: stat.color, 
                    padding: "16px", 
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {stat.icon}
                  </div>

                  {/* Contenedor de Textos y Contador */}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", lineHeight: 1, letterSpacing: "-1px" }}>
                        {stat.prefix}
                        <ContadorAscendente target={stat.numericValue} />
                      </span>
                      <TrendingUp size={18} style={{ color: "#16a34a" }} />
                    </div>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#475569" }}>
                      {stat.label}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
                      {stat.subtext}
                    </p>
                  </div>

                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}