// app/components/dashboards/estudiante/types.ts

export interface EstudiantePerfil {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  correo: string;
  telefono: string;
  especialidad: string;
  foto_url: string | null;
  biografia: string | null;
  intereses: string[];
  pasatiempos: string[];
  formacion: any[];
  experiencia_laboral: any[];
  habilidades: string[];
  linkedin_url: string | null;
  github_url: string | null;
  fecha_nacimiento: string | null;
  telefono_emergencia: string | null;
  direccion: string | null;
  perfil_publico: boolean;
  completitud_perfil: number;
  video_presentacion_url?: string | null;  // opcional
}