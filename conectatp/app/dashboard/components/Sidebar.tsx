'use client';

interface SidebarProps {
  currentRole: string;
  onLogout: () => void;
}

export default function Sidebar({ currentRole, onLogout }: SidebarProps) {
  return (
    <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #1e293b' }}>
      
      {/* Header Corporativo Conecta TP */}
      <div style={{ padding: '28px 24px', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.5px' }}>
          Conecta<span style={{ color: '#2563eb' }}>TP</span>
        </h2>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {currentRole.replace('_', ' ')}
        </div>
      </div>

      {/* Menú - Estructura Aconfex, Estilo Conecta */}
      <div style={{ flex: 1, padding: '24px 16px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>
            <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', backgroundColor: '#2563eb', fontWeight: '600', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
              <span>🏠</span> Inicio
            </a>
          </li>
          {currentRole === 'super_root' && (
            <>
              <li>
                <a href="#liceos" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', fontFamily: 'system-ui, sans-serif', transition: '0.2s' }}>
                  <span>Liceos</span>
                </a>
              </li>
              <li>
                <a href="#usuarios" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', fontFamily: 'system-ui, sans-serif', transition: '0.2s' }}>
                  <span>Lista Blanca</span>
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Footer / Salida */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
        <button onClick={onLogout} style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', fontFamily: 'system-ui, sans-serif' }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}