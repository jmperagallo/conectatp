"use client";

import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Cifras from "./components/Cifras"; 
import CarruselEstrategico from "./components/CarruselEstrategico";
import Footer from "./components/Footer";

export default function LandingPage() {
  const modernFont = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <div style={{ 
      backgroundColor: "#f8fafc", 
      minHeight: "100vh", 
      fontFamily: modernFont, 
      color: "#1e293b", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      
      <Header />

      <main style={{ flexGrow: 1 }}>
        <Hero />
        <Cifras />
        <CarruselEstrategico /> 
      </main>

      <Footer />
      
    </div>
  );
}