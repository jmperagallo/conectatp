'use client';

import { useRouter } from 'next/navigation';

interface Props {
  userEmail: string | null;
  idLiceo: string | null;
}

export default function DashboardCoordinador({ userEmail, idLiceo }: Props) {
  const router = useRouter();

  const handleCompletarPerfil = () => {
    if (idLiceo) {
      router.push(`/admin/registrar-colegio/perfil?id=${idLiceo}`);
    } else {
      console.error('No se encontró el ID del liceo');
      alert('Error: No se pudo identificar tu establecimiento. Contacta al administrador.');
    }
  };

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
        {userEmail && (
          <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '12px' }}>
            Sesión: {userEmail}
          </p>
        )}
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
          onClick={handleCompletarPerfil} 
          style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
        >
          Completar Perfil Ahora →
        </button>
      </div>

      {/* Tarjetas de estadísticas (bloqueadas hasta completar perfil) */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: '#1a365d', fontSize: '16px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
          Resumen del Establecimiento
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#cbd5e1' }}>—</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>Alumnos en Práctica</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Completa tu perfil para ver datos</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#cbd5e1' }}>—</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>Especialidades Activas</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Registra tus Jefes de Especialidad</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#cbd5e1' }}>—</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>Empresas Vinculadas</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Próximamente</div>
          </div>
        </div>
      </div>

      {/* Guía rápida para el coordinador */}
      <div style={{ marginTop: '40px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0369a1', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📋</span> Próximos pasos para activar tu institución
        </h4>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e', fontSize: '13px', lineHeight: '1.8' }}>
          <li>Completa el perfil institucional (logo, misión, visión, datos de contacto)</li>
          <li>Registra a tus Jefes de Especialidad con sus respectivas áreas técnicas</li>
          <li>Los Jefes recibirán un correo para agregar a sus estudiantes</li>
          <li>Los estudiantes completarán sus portafolios y estarán visibles para empresas</li>
        </ol>
      </div>
    </div>
  );
}