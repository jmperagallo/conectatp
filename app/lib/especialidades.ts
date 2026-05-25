export interface Especialidad {
  id: string;
  nombre: string;
}

export interface SectorEconomico {
  id: string;
  sector: string;
  especialidades: Especialidad[];
}

export const SECTORES_TP: SectorEconomico[] = [
  {
    id: "tecnologia_comunicaciones",
    sector: "Tecnología y Comunicaciones",
    especialidades: [
      { id: "conectividad_redes", nombre: "Conectividad y Redes" },
      { id: "telecomunicaciones", nombre: "Telecomunicaciones" },
      { id: "programacion", nombre: "Programación" }
    ]
  },
  {
    id: "administracion_comercio",
    sector: "Administración y Comercio",
    especialidades: [
      { id: "administracion_logistica", nombre: "Administración (Mención Logística)" },
      { id: "administracion_rrhh", nombre: "Administración (Mención Recursos Humanos)" },
      { id: "contabilidad", nombre: "Contabilidad" }
    ]
  },
  {
    id: "metalmecanica",
    sector: "Metalmecánica",
    especialidades: [
      { id: "mecanica_automotriz", nombre: "Mecánica Automotriz" },
      { id: "mecanica_industrial_electromecanico", nombre: "Mecánica Industrial (Mención Mantenimiento Electromecánico)" },
      { id: "mecanica_industrial_herramientas", nombre: "Mecánica Industrial (Mención Máquinas-Herramientas)" },
      { id: "mecanica_industrial_matriceria", nombre: "Mecánica Industrial (Mención Matricería)" },
      { id: "construcciones_metalicas", nombre: "Construcciones Metálicas" },
      { id: "mecanica_aeronaves", nombre: "Mecánica de Mantenimiento de Aeronaves" }
    ]
  },
  {
    id: "electricidad_energia",
    sector: "Electricidad y Energía",
    especialidades: [
      { id: "electricidad", nombre: "Electricidad" },
      { id: "electronica", nombre: "Electrónica" }
    ]
  },
  {
    id: "alimentacion",
    sector: "Alimentación",
    especialidades: [
      { id: "gastronomia_cocina", nombre: "Gastronomía (Mención Cocina)" },
      { id: "gastronomia_pasteleria", nombre: "Gastronomía (Mención Pastelería y Repostería)" },
      { id: "elaboracion_alimentos", nombre: "Elaboración Industrial de Alimentos" }
    ]
  },
  {
    id: "salud_educacion",
    sector: "Salud y Educación",
    especialidades: [
      { id: "enfermeria_enfermeria", nombre: "Atención de Enfermería (Mención Enfermería)" },
      { id: "enfermeria_adulto_mayor", nombre: "Atención de Enfermería (Mención Adulto Mayor)" },
      { id: "parvulos", nombre: "Atención de Párvulos" }
    ]
  },
  {
    id: "construccion",
    sector: "Construcción",
    especialidades: [
      { id: "construccion_edificacion", nombre: "Construcción (Mención Edificación)" },
      { id: "construccion_terminaciones", nombre: "Construcción (Mención Terminaciones de la Construcción)" },
      { id: "construccion_viales", nombre: "Construcción (Mención Obras Viales e Infraestructura)" },
      { id: "montaje_industrial", nombre: "Montaje Industrial" },
      { id: "instalaciones_sanitarias", nombre: "Instalaciones Sanitarias" },
      { id: "refrigeracion_climatizacion", nombre: "Refrigeración y Climatización" }
    ]
  },
  {
    id: "mineria",
    sector: "Minería",
    especialidades: [
      { id: "explotacion_minera", nombre: "Explotación Minera" },
      { id: "metalurgia_extractiva", nombre: "Metalurgia Extractiva" },
      { id: "asistencia_geologia", nombre: "Asistencia en Geología" }
    ]
  },
  {
    id: "hoteleria_turismo",
    sector: "Hotelería y Turismo",
    especialidades: [
      { id: "servicios_hoteleria", nombre: "Servicios de Hotelería" },
      { id: "servicios_turismo", nombre: "Servicios de Turismo" }
    ]
  },
  {
    id: "agropecuario",
    sector: "Agropecuario",
    especialidades: [
      { id: "agropecuaria_agricultura", nombre: "Agropecuaria (Mención Agricultura)" },
      { id: "agropecuaria_pecuaria", nombre: "Agropecuaria (Mención Pecuaria)" },
      { id: "agropecuaria_vitivinicola", nombre: "Agropecuaria (Mención Vitivinícola)" }
    ]
  },
  {
    id: "maritimo",
    sector: "Marítimo",
    especialidades: [
      { id: "acuicultura", nombre: "Acuicultura" },
      { id: "pesqueria", nombre: "Pesquería" },
      { id: "operaciones_portuarias", nombre: "Operaciones Portuarias" },
      { id: "tripulacion_naves", nombre: "Tripulación de Naves Mercantes y Especiales" }
    ]
  },
  {
    id: "quimica_industria",
    sector: "Química e Industria",
    especialidades: [
      { id: "quimica_industrial_laboratorio", nombre: "Química Industrial (Mención Laboratorio Químico)" },
      { id: "quimica_industrial_planta", nombre: "Química Industrial (Mención Planta Química)" }
    ]
  },
  {
    id: "maderero",
    sector: "Maderero",
    especialidades: [
      { id: "forestal", nombre: "Forestal" },
      { id: "muebles_madera", nombre: "Muebles y Terminaciones en Madera" }
    ]
  },
  {
    id: "grafico",
    sector: "Gráfico",
    especialidades: [
      { id: "grafica", nombre: "Gráfica" },
      { id: "dibujo_tecnico", nombre: "Dibujo Técnico" }
    ]
  },
  {
    id: "confeccion",
    sector: "Confección",
    especialidades: [
      { id: "vestuario_textil", nombre: "Vestuario y Confección Textil" }
    ]
  }
];