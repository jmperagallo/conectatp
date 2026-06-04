'use client';

interface Props {
  role: string | null;
}

export default function DashboardEstudiante({ role }: Props) {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#1a365d', margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>
        Módulo Estudiante en Construcción
      </h2>
      <p style={{ color: '#4b5563', margin: 0, fontSize: '14px' }}>
        Tu cuenta posee el rol de <strong>{role || 'estudiante'}</strong>.
      </p>
    </div>
  );
}