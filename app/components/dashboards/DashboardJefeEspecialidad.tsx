'use client';

interface Props {
  userEmail: string | null;
}

export default function DashboardJefeEspecialidad({ userEmail }: Props) {
  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a365d', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
          Módulo Docente TP
        </span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Panel Jefe de Especialidad
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
          Docente Activo: <span style={{ color: '#334151', fontWeight: '600' }}>{userEmail}</span>
        </p>
      </div>

      {/* Tarjetas de Métricas de la Especialidad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Mis Alumnos</span>
            <span style={{ fontSize: '18px' }}>👨‍🎓</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a365d', margin: 0 }}>0</h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Postulantes a práctica</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Empresas Aliadas</span>
            <span style={{ fontSize: '18px' }}>🏢</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a365d', margin: 0 }}>0</h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Convenios activos</div>
        </div>
      </div>

      {/* SECCIÓN ACCIÓN: CARGAR ALUMNOS */}
      <div style={{ marginTop: '40px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, color: '#1a365d', fontSize: '18px', fontWeight: '700' }}>🚀 Carga Inicial de Estudiantes</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
          Para que tus estudiantes de 4° Medio puedan ingresar a la plataforma y postular a sus centros de práctica, debes subir la nómina oficial del curso utilizando nuestra planilla estándar de Excel/CSV.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button style={{ backgroundColor: '#1a365d', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            📥 Descargar Plantilla Modelo
          </button>
          <button style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            📤 Subir Nómina de Alumnos
          </button>
        </div>
      </div>
    </div>
  );
}