'use client';

import { useRouter } from 'next/navigation';

export default function DashboardCoordinador() {
  const router = useRouter();

  // 👇 ID temporal para hacer la prueba. Luego lo cambiaremos por el dinámico de Supabase.
  const liceoId = "1"; 

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
          Panel Institucional
        </span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Bienvenido, Coordinador
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
          Gestiona los procesos de práctica de tu establecimiento desde aquí.
        </p>
      </div>

      {/* BANNER DE ALERTA AL ESTILO CONECTATP */}
      <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 6px rgba(249, 115, 22, 0.05)' }}>
        <div>
          <h3 style={{ margin: 0, color: '#c2410c', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Configuración Inicial Pendiente
          </h3>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#9a3412', maxWidth: '600px', lineHeight: '1.5' }}>
            Para activar tu ecosistema y permitir que los estudiantes comiencen sus procesos, debes completar el perfil institucional y registrar a tus Jefes de Especialidad.
          </p>
        </div>
        <button 
          onClick={() => router.push(`/admin/registrar-colegio/perfil?id=${liceoId}`)} 
          style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}
        >
          Completar Perfil Ahora →
        </button>
      </div>

      {/* Marcadores de posición bloqueados */}
      <div style={{ marginTop: '32px', opacity: 0.5, pointerEvents: 'none' }}>
        <h3 style={{ color: '#1a365d', fontSize: '16px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
          Resumen del Liceo (Bloqueado)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#94a3b8' }}>0</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Alumnos en Práctica</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#94a3b8' }}>0</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Especialidades Activas</div>
          </div>
        </div>
      </div>
    </div>
  );
}