'use client';

interface SuperRootProps {
  email: string;
}

export default function SuperRootDashboard({ email }: SuperRootProps) {
  const stats = { liceos: 0, usuarios: 1, almacenamiento: '0 MB' };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Encabezado limpio de sección */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Plataforma de Prácticas</span>
        <h1 style={{ color: '#1e3a8a', fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Panel de Control Global</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Super Root Activo: <span style={{ color: '#374151', fontWeight: '600' }}>{email}</span></p>
      </div>

      {/* Cuadrícula Bento (Inspiración Aconfex con Look Conecta) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        
        {/* Módulo Liceos */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Liceos de Chile</span>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>🏫</div>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{stats.liceos}</h2>
          </div>
          <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
            Administrar Establecimientos →
          </div>
        </div>

        {/* Módulo Lista Blanca */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lista Blanca</span>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>🛡️</div>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{stats.usuarios}</h2>
          </div>
          <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
            Gestionar Accesos Autorizados →
          </div>
        </div>

        {/* Módulo Servidor R2 */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Almacenamiento R2</span>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#f0fdf4', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold' }}>☁️</div>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{stats.almacenamiento}</h2>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginTop: '12px' }}>
            Videos de Alumnos Activos
          </div>
        </div>

      </div>
    </div>
  );
}