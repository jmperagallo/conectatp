'use client';

import { useRouter } from 'next/navigation';

interface Liceo {
  id: string;
  nombre: string;
  rbd: string;
  region: string;
  comuna: string;
}

interface Props {
  userEmail: string | null;
  liceos: Liceo[];
  onEliminarLiceo: (rbd: string, nombre: string) => Promise<void>;
}

export default function DashboardSuperRoot({ userEmail, liceos, onEliminarLiceo }: Props) {
  const router = useRouter();

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
          Plataforma de Prácticas
        </span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Panel de Control Global
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
          Super Root Activo: <span style={{ color: '#334151', fontWeight: '600' }}>{userEmail}</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        {/* Tarjeta de Liceos */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Liceos de Chile</span>
              <span style={{ fontSize: '20px' }}>🏫</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a365d', margin: 0 }}>{liceos.length}</h2>
          </div>
          <button 
            onClick={() => router.push('/admin/colegios')}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#f97316', fontWeight: '600', cursor: 'pointer', marginTop: '12px', textAlign: 'left', display: 'block' }}
          >
            + Registrar con RBD Mineduc →
          </button>
        </div>

        {/* Tarjeta Lista Blanca */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Lista Blanca</span>
              <span style={{ fontSize: '20px' }}>🛡️</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a365d', margin: 0 }}>1</h2>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '12px' }}>Accesos autorizados</div>
        </div>

        {/* Tarjeta Almacenamiento */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Almacenamiento R2</span>
              <span style={{ fontSize: '20px' }}>☁️</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a365d', margin: 0 }}>0 MB</h2>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '12px' }}>Videos de Alumnos</div>
        </div>
      </div>

      {/* TABLA DE COLEGIOS */}
      {liceos.length > 0 && (
        <div style={{ marginTop: '40px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1a365d', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700' }}>Listado de Establecimientos</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4b5563', fontWeight: '700' }}>
                <th style={{ padding: '10px' }}>Nombre</th>
                <th style={{ padding: '10px' }}>RBD</th>
                <th style={{ padding: '10px' }}>Comuna</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {liceos.map((lic) => (
                <tr key={lic.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '600' }}>{lic.nombre}</td>
                  <td style={{ padding: '12px 10px' }}>{lic.rbd}</td>
                  <td style={{ padding: '12px 10px' }}>{lic.comuna || 'No asignada'}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <button
                      onClick={() => onEliminarLiceo(lic.rbd, lic.nombre)}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}