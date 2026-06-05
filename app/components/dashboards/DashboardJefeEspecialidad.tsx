'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Props {
  userEmail: string | null;
  idLiceo: string | null;
}

export default function DashboardJefeEspecialidad({ userEmail, idLiceo }: Props) {
  const [profesor, setProfesor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userEmail) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('lista_blanca')
          .select('nombre, apellido_paterno, especialidad')
          .eq('correo', userEmail)
          .single();
        if (error) throw error;
        setProfesor(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [userEmail, supabase]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTop: '3px solid #1a365d', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
        <p>Cargando datos del profesor...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', color: '#991b1b' }}>
        <strong>Error al cargar:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Panel del Jefe de Especialidad
        </span>
        <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: '800', margin: '4px 0 8px' }}>
          Bienvenido, {profesor?.nombre} {profesor?.apellido_paterno}
        </h1>
        <p style={{ color: '#64748b' }}>Especialidad: <strong>{profesor?.especialidad}</strong></p>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>ID Liceo: {idLiceo} | Email: {userEmail}</p>
      </div>

      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
        <p style={{ color: '#166534', margin: 0 }}>
          ✅ Depuración exitosa. El dashboard del profesor funciona correctamente.
          <br />
          Próximamente se agregará la gestión de estudiantes (carga manual y masiva).
        </p>
      </div>
    </div>
  );
}