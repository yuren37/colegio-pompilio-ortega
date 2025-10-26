// lib/docentesStorage.ts
import { Docente, Fundador, DocentesData } from '@/types/docente';

// Datos iniciales para poblar la base de datos
const datosIniciales: DocentesData = {
  fundador: {
    nombre: "Maestro Danilo Amaya",
    titulo: "Fundador y Rector",
    descripcion: "Referente en la educación hondureña, revolucionario y visionario. Reconocido como el mejor maestro de matemáticas de la región con múltiples premios nacionales e internacionales.",
    especialidad: "Matemáticas",
    reconocimientos: [
      "Mejor Maestro de Matemáticas de la Región",
      "Múltiples Premios Nacionales",
      "Reconocimientos Internacionales",
      "Fundador del Colegio Nestor Danilo Amaya"
    ],
    esLegenda: true,
    foto: ""
  },
  docentes: [
    {
      id: 1,
      nombre: "Lic. Wilson Madrid",
      titulo: "Director del Colegio",
      formacion: ["Licenciado en Ciencias Sociales", "Maestría en Administración Educativa"],
      materias: ["Filosofía 11vo", "Arte 11vo", "Estudios Sociales Ciclo Común", "Liderazgo Estudiantil"],
      experiencia: "15+ años",
      especialidad: "Ciencias Sociales y Humanidades",
      icono: "Users",
      foto: "",
      color: "from-blue-500 to-cyan-400",
      descripcionCompleta: "Con una trayectoria de más de 15 años en educación, el Lic. Wilson Madrid ha liderado importantes proyectos de innovación educativa en la institución. Su enfoque humanista y compromiso con la excelencia académica han sido fundamentales para el desarrollo institucional.",
      logros: [
        "Lideró la implementación del programa de robótica educativa",
        "Coordinador de proyectos de intercambio cultural internacional",
        "Premio al Mejor Director Educativo 2022"
      ],
      contacto: "Disponible para consultas administrativas y orientación estudiantil",
      activo: true,
      orden: 1
    },
    {
      id: 2,
      nombre: "Lic. Nury Castillo",
      titulo: "Docente de Español y Psicología",
      formacion: ["Licenciada en Español y Psicología", "Especialización en Psicopedagogía"],
      materias: ["Español (Todos los cursos excepto 12vo BTP)", "Psicología 10mo", "Orientación Vocacional"],
      experiencia: "12+ años",
      especialidad: "Lenguaje y Psicopedagogía",
      icono: "BookOpen",
      foto: "",
      color: "from-purple-500 to-pink-400",
      descripcionCompleta: "Especialista en desarrollo del lenguaje y procesos cognitivos. La Lic. Castillo combina su expertise en español con herramientas psicológicas para potenciar el aprendizaje integral de los estudiantes.",
      logros: [
        "Desarrolló el programa de comprensión lectora avanzada",
        "Coautora de materiales didácticos para enseñanza del español"
      ],
      contacto: "Atención personalizada para dificultades de aprendizaje",
      activo: true,
      orden: 2
    }
  ]
};

class DocentesStorage {
  private readonly STORAGE_KEY = 'docentesData';

  // Función para convertir File a Base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Función para validar y comprimir imagen
  private async procesarImagen(file: File): Promise<string> {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('Por favor, selecciona un archivo de imagen válido');
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('La imagen debe ser menor a 2MB');
    }

    // Convertir a Base64
    return await this.fileToBase64(file);
  }

  // Inicializar datos si no existen
  private inicializarDatos(): DocentesData {
    const datosExistentes = this.getDocentesData();
    if (!datosExistentes) {
      this.saveDocentesData(datosIniciales);
      return datosIniciales;
    }
    return datosExistentes;
  }

  // Obtener todos los datos
  getDocentesData(): DocentesData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer datos de docentes:', error);
      return null;
    }
  }

  // Guardar todos los datos
  saveDocentesData(data: DocentesData): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar datos de docentes:', error);
      return false;
    }
  }

  // Obtener docentes activos
  getDocentes(): Docente[] {
    const data = this.getDocentesData() || this.inicializarDatos();
    return data.docentes.filter(docente => docente.activo)
                       .sort((a, b) => a.orden - b.orden);
  }

  // Obtener docente por ID
  getDocenteById(id: number): Docente | null {
    const docentes = this.getDocentes();
    return docentes.find(docente => docente.id === id) || null;
  }

  // Obtener información del fundador
  getFundador(): Fundador {
    const data = this.getDocentesData() || this.inicializarDatos();
    return data.fundador;
  }

  // Actualizar docente
  async updateDocente(id: number, docenteActualizado: Partial<Docente>): Promise<boolean> {
    const data = this.getDocentesData() || this.inicializarDatos();
    
    const docenteIndex = data.docentes.findIndex(d => d.id === id);
    if (docenteIndex === -1) return false;

    data.docentes[docenteIndex] = { ...data.docentes[docenteIndex], ...docenteActualizado };
    return this.saveDocentesData(data);
  }

  // Agregar nuevo docente
  async addDocente(nuevoDocente: Omit<Docente, 'id'>): Promise<boolean> {
    const data = this.getDocentesData() || this.inicializarDatos();
    
    const nuevoId = Math.max(...data.docentes.map(d => d.id), 0) + 1;
    const docenteCompleto: Docente = {
      ...nuevoDocente,
      id: nuevoId
    };

    data.docentes.push(docenteCompleto);
    return this.saveDocentesData(data);
  }

  // Eliminar docente (marcar como inactivo)
  async deleteDocente(id: number): Promise<boolean> {
    return await this.updateDocente(id, { activo: false });
  }

  // Actualizar información del fundador
  async updateFundador(fundadorActualizado: Partial<Fundador>): Promise<boolean> {
    const data = this.getDocentesData() || this.inicializarDatos();
    
    data.fundador = { ...data.fundador, ...fundadorActualizado };
    return this.saveDocentesData(data);
  }

  // Reordenar docentes
  async reordenarDocentes(idsOrdenados: number[]): Promise<boolean> {
    const data = this.getDocentesData() || this.inicializarDatos();
    
    data.docentes.forEach(docente => {
      docente.orden = idsOrdenados.indexOf(docente.id);
    });

    data.docentes.sort((a, b) => a.orden - b.orden);
    return this.saveDocentesData(data);
  }

  // Método específico para subir imagen de docente
  async subirImagenDocente(id: number, file: File): Promise<boolean> {
    try {
      const imagenBase64 = await this.procesarImagen(file);
      return await this.updateDocente(id, { foto: imagenBase64 });
    } catch (error) {
      console.error('Error subiendo imagen de docente:', error);
      throw error;
    }
  }

  // Método específico para subir imagen de fundador
  async subirImagenFundador(file: File): Promise<boolean> {
    try {
      const imagenBase64 = await this.procesarImagen(file);
      return await this.updateFundador({ foto: imagenBase64 });
    } catch (error) {
      console.error('Error subiendo imagen de fundador:', error);
      throw error;
    }
  }
}

export const docentesStorage = new DocentesStorage();