// types/carrera.ts
export interface IconoInteractivo {
  icono: string;
  tooltip: string;
  color: string;
}

export interface Carrera {
  id: number;
  nombre: string;
  duracion: string;
  estudiantes: string;
  area: string;
  descripcion: string;
  descripcionCompleta: string;
  icono: string;
  color: string;
  bgColor: string;
  iconosInteractivos: IconoInteractivo[];
  materias: string[];
  beneficios: string[];
  requisitos: string[];
  imagenes: string[];
  activo: boolean;
  orden: number;
}

export interface CarrerasData {
  carreras: Carrera[];
}