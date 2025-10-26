// lib/carrerasStorage.ts
import { Carrera, CarrerasData } from '@/types/carrera';

// Datos iniciales para poblar la base de datos
const datosIniciales: CarrerasData = {
  carreras: [
    {
      id: 1,
      nombre: "BTP en Informática",
      duracion: "3 años",
      estudiantes: "150+",
      area: "Técnica",
      descripcion: "Especialización en desarrollo de software, redes, soporte técnico y programación. Incluye clases de robótica e informática avanzada.",
      descripcionCompleta: "El Bachillerato Técnico Profesional en Informática ofrece una formación integral en tecnologías de la información, preparando a los estudiantes para los desafíos del mundo digital.",
      icono: "Cpu",
      color: "from-[#7D8A6E] to-[#657057]",
      bgColor: "from-[#9CA98C]/10 to-[#7D8A6E]/5",
      iconosInteractivos: [
        { icono: "Code", tooltip: "Programación", color: "text-[#7D8A6E]" },
        { icono: "Database", tooltip: "Base de Datos", color: "text-[#657057]" },
        { icono: "Network", tooltip: "Redes", color: "text-[#9CA98C]" },
        { icono: "Server", tooltip: "Servidores", color: "text-[#434343]" }
      ],
      materias: ["Programación", "Redes y Telecomunicaciones", "Base de Datos", "Soporte Técnico", "Robótica", "Desarrollo Web"],
      beneficios: ["Laboratorios equipados", "Certificaciones internacionales", "Prácticas profesionales", "Proyectos reales"],
      requisitos: ["Certificado de 9no grado", "Interés en tecnología", "Habilidades lógico-matemáticas"],
      imagenes: [],
      activo: true,
      orden: 1
    },
    {
      id: 2,
      nombre: "Bachillerato en Ciencias y Humanidades",
      duracion: "2 años",
      estudiantes: "200+",
      area: "Ciencias",
      descripcion: "Formación integral en ciencias exactas y humanidades con enfoque en investigación científica y pensamiento crítico.",
      descripcionCompleta: "El Bachillerato en Ciencias y Humanidades proporciona una educación integral que combina el rigor científico con la profundidad humanística.",
      icono: "Atom",
      color: "from-[#434343] to-[#666666]",
      bgColor: "from-[#434343]/10 to-[#666666]/5",
      iconosInteractivos: [
        { icono: "Brain", tooltip: "Pensamiento Crítico", color: "text-[#434343]" },
        { icono: "Calculator", tooltip: "Matemáticas", color: "text-[#666666]" },
        { icono: "GraduationCap", tooltip: "Investigación", color: "text-[#9CA98C]" },
        { icono: "Book", tooltip: "Humanidades", color: "text-[#7D8A6E]" }
      ],
      materias: ["Matemáticas Avanzadas", "Física", "Química", "Literatura", "Filosofía", "Metodología de Investigación"],
      beneficios: ["Laboratorio de ciencias", "Proyectos de investigación", "Olimpiadas científicas", "Preparación universitaria"],
      requisitos: ["Certificado de 9no grado", "Bases en matemáticas y ciencias", "Interés por la investigación"],
      imagenes: [],
      activo: true,
      orden: 2
    },
    {
      id: 3,
      nombre: "Ciclo Común",
      duracion: "3 años",
      estudiantes: "300+",
      area: "Básica",
      descripcion: "Educación secundaria básica con formación integral. Incluye clases de informática y robótica integradas en el pénsum académico.",
      descripcionCompleta: "El Ciclo Común proporciona las bases sólidas para una educación de calidad. Integramos tecnología y valores para formar estudiantes competentes.",
      icono: "Book",
      color: "from-[#9CA98C] to-[#7D8A6E]",
      bgColor: "from-[#9CA98C]/10 to-[#7D8A6E]/5",
      iconosInteractivos: [
        { icono: "GraduationCap", tooltip: "Educación Integral", color: "text-[#9CA98C]" },
        { icono: "Users", tooltip: "Desarrollo Social", color: "text-[#7D8A6E]" },
        { icono: "Shield", tooltip: "Valores", color: "text-[#434343]" },
        { icono: "Sparkles", tooltip: "Creatividad", color: "text-[#666666]" }
      ],
      materias: ["Matemáticas", "Ciencias Naturales", "Lengua y Literatura", "Informática", "Robótica", "Inglés", "Educación Física"],
      beneficios: ["Aulas tecnológicas", "Programa de valores", "Deportes y cultura", "Tutorías personalizadas"],
      requisitos: ["Certificado de 6to grado", "Edad apropiada", "Disposición para el aprendizaje"],
      imagenes: [],
      activo: true,
      orden: 3
    }
  ]
};

class CarrerasStorage {
  private readonly STORAGE_KEY = 'carrerasData';

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
    if (!file.type.startsWith('image/')) {
      throw new Error('Por favor, selecciona un archivo de imagen válido');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('La imagen debe ser menor a 2MB');
    }

    return await this.fileToBase64(file);
  }

  // Inicializar datos si no existen
  private inicializarDatos(): CarrerasData {
    const datosExistentes = this.getCarrerasData();
    if (!datosExistentes) {
      this.saveCarrerasData(datosIniciales);
      return datosIniciales;
    }
    return datosExistentes;
  }

  // Obtener todos los datos
  getCarrerasData(): CarrerasData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer datos de carreras:', error);
      return null;
    }
  }

  // Guardar todos los datos
  saveCarrerasData(data: CarrerasData): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar datos de carreras:', error);
      return false;
    }
  }

  // Obtener carreras activas
  getCarreras(): Carrera[] {
    const data = this.getCarrerasData() || this.inicializarDatos();
    return data.carreras.filter(carrera => carrera.activo)
                       .sort((a, b) => a.orden - b.orden);
  }

  // Obtener carrera por ID
  getCarreraById(id: number): Carrera | null {
    const carreras = this.getCarreras();
    return carreras.find(carrera => carrera.id === id) || null;
  }

  // Actualizar carrera
  async updateCarrera(id: number, carreraActualizada: Partial<Carrera>): Promise<boolean> {
    const data = this.getCarrerasData() || this.inicializarDatos();
    
    const carreraIndex = data.carreras.findIndex(c => c.id === id);
    if (carreraIndex === -1) return false;

    data.carreras[carreraIndex] = { ...data.carreras[carreraIndex], ...carreraActualizada };
    return this.saveCarrerasData(data);
  }

  // Agregar nueva carrera
  async addCarrera(nuevaCarrera: Omit<Carrera, 'id'>): Promise<boolean> {
    const data = this.getCarrerasData() || this.inicializarDatos();
    
    const nuevoId = Math.max(...data.carreras.map(c => c.id), 0) + 1;
    const carreraCompleta: Carrera = {
      ...nuevaCarrera,
      id: nuevoId
    };

    data.carreras.push(carreraCompleta);
    return this.saveCarrerasData(data);
  }

  // Eliminar carrera (marcar como inactiva)
  async deleteCarrera(id: number): Promise<boolean> {
    return await this.updateCarrera(id, { activo: false });
  }

  // Reordenar carreras
  async reordenarCarreras(idsOrdenados: number[]): Promise<boolean> {
    const data = this.getCarrerasData() || this.inicializarDatos();
    
    data.carreras.forEach(carrera => {
      carrera.orden = idsOrdenados.indexOf(carrera.id);
    });

    data.carreras.sort((a, b) => a.orden - b.orden);
    return this.saveCarrerasData(data);
  }

  // Método específico para subir imagen de carrera
  async subirImagenCarrera(id: number, file: File, index?: number): Promise<boolean> {
    try {
      const imagenBase64 = await this.procesarImagen(file);
      const carrera = this.getCarreraById(id);
      
      if (!carrera) return false;

      let nuevasImagenes = [...carrera.imagenes];
      
      if (index !== undefined && index < nuevasImagenes.length) {
        // Reemplazar imagen existente
        nuevasImagenes[index] = imagenBase64;
      } else {
        // Agregar nueva imagen
        nuevasImagenes.push(imagenBase64);
      }

      return await this.updateCarrera(id, { imagenes: nuevasImagenes });
    } catch (error) {
      console.error('Error subiendo imagen de carrera:', error);
      throw error;
    }
  }

  // Eliminar imagen de carrera
  async eliminarImagenCarrera(id: number, index: number): Promise<boolean> {
    const carrera = this.getCarreraById(id);
    
    if (!carrera) return false;

    const nuevasImagenes = carrera.imagenes.filter((_, i) => i !== index);
    return await this.updateCarrera(id, { imagenes: nuevasImagenes });
  }
}

export const carrerasStorage = new CarrerasStorage();