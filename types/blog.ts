// types/docente.ts
export interface Docente {
  id: number;
  nombre: string;
  titulo: string;
  formacion: string[];
  materias: string[];
  experiencia: string;
  especialidad: string;
  icono: string;
  foto: string;
  color: string;
  descripcionCompleta: string;
  logros: string[];
  contacto: string;
  activo: boolean;
  orden: number;
}

export interface Fundador {
  nombre: string;
  titulo: string;
  descripcion: string;
  especialidad: string;
  reconocimientos: string[];
  esLegenda: boolean;
  foto: string;
}

export interface DocentesData {
  docentes: Docente[];
  fundador: Fundador;
}