'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import DashboardSuperRoot from '../components/dashboards/DashboardSuperRoot';
import DashboardCoordinador from '../components/dashboards/DashboardCoordinador';
import DashboardJefeEspecialidad from '../components/dashboards/DashboardJefeEspecialidad';
import DashboardEstudiante from '../components/dashboards/DashboardEstudiante';

interface Liceo {
  id: string;
  nombre: string;
  rbd: string;
  region: string;
  comuna: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [idLiceo, setIdLiceo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [liceos, setLiceos] = useState<Liceo[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchLiceos = async () => {
    const { data, error } = await supabase
      .from('liceos')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (!error && data) setLiceos(data);
  };

  const handleEliminarLiceo = async (rbdAEliminar: string, nombreLiceo: string) => {
    const confirmar = window.confirm(`⚠️ ACCIÓN CONTROLADA (SU)\n\n¿Deseas eliminar permanentemente el liceo "${nombreLiceo}"?`);
    if (!confirmar) return;

    try {
      const { error } = await supabase.from('liceos').delete().eq('rbd', rbdAEliminar);
      if (error) throw error;
      setLiceos(prev => prev.filter(l => l.rbd !== rbdAEliminar));
      alert('¡Registro eliminado con éxito!');
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (isMounted) router.replace('/login');
        return;
      }

      const emailLimpio = session.user.email ? session.user.email.trim().toLowerCase() : '';
      if (isMounted) setUserEmail(emailLimpio);

      // SUPER ADMIN - cuenta global
      if (emailLimpio === 'contacto@conectatp.cl') {
        if (isMounted) {
          setRole('super_root');
          setLoading(false);
        }
        await fetchLiceos();
        return;
      }

      try {
        const { data, error }: any = await supabase
          .from('lista_blanca')
          .select('rol, id_liceo')
          .eq('correo', emailLimpio)
          .maybeSingle();

        if (isMounted) {
          if (data && !error) {
            setRole(data.rol || data.role);
            const liceoIdDetectado = data.id_liceo || null;
            setIdLiceo(liceoIdDetectado);

            // 🚨 ESCUDO DE CONTROL: Validación de Primer Ingreso para Coordinación
            if (data.rol === 'coordinador' || data.rol === 'administrador_liceo') {
              if (liceoIdDetectado) {
                const { data: liceoCheck, error: errCheck } = await supabase
                  .from('liceos')
                  .select('encargado_nombres')
                  .eq('id', liceoIdDetectado)
                  .single();

                // Si no hay datos guardados del encargado, se le fuerza a ir al formulario de perfil
                if (errCheck || !liceoCheck || !liceoCheck.encargado_nombres) {
                  // ✅ CORREGIDO: Ruta completa al formulario de perfil
                  router.replace(`/admin/registrar-colegio/perfil?id=${liceoIdDetectado}`);
                  return;
                }
              }
            }

          } else {
            setRole('estudiante');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setRole('estudiante');
          setLoading(false);
        }
      }
    };

    checkSessionAndRole();
    return () => { isMounted = false; };
  }, [supabase, router]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #1a365d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a365d', margin: 0 }}>Cargando Conecta TP...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex' }}>
      
      {/* MENÚ LATERAL */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #1e293b' }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Conecta<span style={{ color: '#f97316' }}>TP</span>
          </h2>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#fdba74', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {role ? role.replace('_', ' ') : 'Cargando...'}
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', backgroundColor: '#1a365d', fontWeight: '600', fontSize: '14px' }}>
                <span>🏠</span> Inicio
              </a>
            </li>
          </ul>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          <button onClick={handleLogout} style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div style={{ marginLeft: '260px', padding: '40px', flex: 1, boxSizing: 'border-box' }}>
        {role === 'super_root' && (
          <DashboardSuperRoot userEmail={userEmail} liceos={liceos} onEliminarLiceo={handleEliminarLiceo} />
        )}

        {(role === 'coordinador' || role === 'administrador_liceo') && (
          <DashboardCoordinador userEmail={userEmail} idLiceo={idLiceo} />
        )}

        {role === 'jefe_especialidad' && (
          <DashboardJefeEspecialidad userEmail={userEmail} idLiceo={idLiceo} />
        )}

        {role !== 'super_root' && role !== 'coordinador' && role !== 'administrador_liceo' && role !== 'jefe_especialidad' && (
          <DashboardEstudiante role={role} />
        )}
      </div>

    </div>
  );
}