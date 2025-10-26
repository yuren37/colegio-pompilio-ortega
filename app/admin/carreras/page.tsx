'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  X,
  ArrowLeft,
  Eye,
  ChevronUp,
  ChevronDown,
  Save
} from 'lucide-react';
import { carrerasStorage } from '@/lib/carrerasStorage';
import { Carrera, IconoInteractivo } from '@/types/carrera';

// Mapeo de iconos disponibles - AÑADIDOS NUEVOS ICONOS
const iconosDisponibles = [
  'Cpu', 'Atom', 'Book', 'Code', 'Database', 'Network', 'Server', 
  'Brain', 'Calculator', 'GraduationCap', 'Users', 'Shield', 'Sparkles',
  'Target', 'Zap', 'Clock', 'CheckCircle2', 'Laptop', 'Microscope',
  'Palette', 'Music', 'Dumbbell', 'Languages', 'Baby', 'School', 
  'Flask', 'BookOpen', 'Globe', 'Heart', 'Home', 'Star', 'Award',
  'Rocket', 'Lightbulb', 'Puzzle', 'Gamepad', 'Tree', 'Leaf'
];

const coloresMap = [
  'from-[#7D8A6E] to-[#657057]',
  'from-[#434343] to-[#666666]', 
  'from-[#9CA98C] to-[#7D8A6E]',
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-amber-400',
  'from-red-500 to-rose-400'
];

// NUEVAS ÁREAS AÑADIDAS
const areasDisponibles = [
  "Técnica", 
  "Ciencias", 
  "Básica", 
  "Media", 
  "Pre-básica", 
  "Pre-school",
  "Bilingüe",
  "Científica",
  "Artística",
  "Deportiva"
];

export default function AdminCarreras() {
  const router = useRouter();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carreraEditando, setCarreraEditando] = useState<Carrera | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estado para nueva carrera
  const [nuevaCarrera, setNuevaCarrera] = useState<Omit<Carrera, 'id' | 'activo' | 'orden'>>({
    nombre: '',
    duracion: '',
    estudiantes: '',
    area: 'Técnica',
    descripcion: '',
    descripcionCompleta: '',
    icono: 'GraduationCap',
    color: 'from-[#7D8A6E] to-[#657057]',
    bgColor: 'from-[#9CA98C]/10 to-[#7D8A6E]/5',
    iconosInteractivos: [
      { icono: 'Book', tooltip: 'Educación', color: 'text-[#7D8A6E]' },
      { icono: 'Users', tooltip: 'Social', color: 'text-[#657057]' },
      { icono: 'Star', tooltip: 'Calidad', color: 'text-[#9CA98C]' },
      { icono: 'Award', tooltip: 'Logros', color: 'text-[#434343]' }
    ],
    materias: [],
    beneficios: [],
    requisitos: [],
    imagenes: []
  });

  const [nuevaMateria, setNuevaMateria] = useState('');
  const [nuevoBeneficio, setNuevoBeneficio] = useState('');
  const [nuevoRequisito, setNuevoRequisito] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState<string | null>(null);

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('blog-auth') === 'true';
    if (!isAuthenticated) {
      router.push('/blog/dashboard/login');
      return;
    }
    cargarDatos();
  }, [router]);

  const cargarDatos = () => {
    try {
      const carrerasData = carrerasStorage.getCarreras();
      setCarreras(carrerasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos de carreras');
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN SUBIR IMAGEN - CORREGIDA CON TIPOS
  const subirImagen = async (event: React.ChangeEvent<HTMLInputElement>, carreraId: number, index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    setSubiendoImagen(`carrera-${carreraId}-${index ?? 'new'}`);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const imagenBase64 = reader.result as string;
        
        try {
          const success = await carrerasStorage.subirImagenCarrera(carreraId, file, index);
          if (success) {
            // Actualizar estado local si estamos editando esta carrera
            if (carreraEditando && carreraEditando.id === carreraId) {
              const carreraActual = carrerasStorage.getCarreraById(carreraId);
              if (carreraActual) {
                setCarreraEditando(carreraActual);
              }
            }
            // Recargar lista de carreras
            cargarDatos();
            alert('Imagen de la carrera actualizada correctamente');
          }
        } catch (error) {
          console.error('Error guardando imagen:', error);
          alert('Error al guardar la imagen');
        } finally {
          setSubiendoImagen(null);
          event.target.value = '';
        }
      };

      reader.onerror = () => {
        alert('Error al procesar la imagen');
        setSubiendoImagen(null);
        event.target.value = '';
      };
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
      setSubiendoImagen(null);
      event.target.value = '';
    }
  };

  // SISTEMA DE ETIQUETAS PARA MATERIAS - CORREGIDO CON TIPOS
  const agregarMateria = (esNueva: boolean = false) => {
    if (esNueva ? nuevaMateria.trim() : nuevaMateria.trim()) {
      if (carreraEditando) {
        const materiasActualizadas = [...carreraEditando.materias, nuevaMateria.trim()];
        setCarreraEditando(prev => prev ? { ...prev, materias: materiasActualizadas } : null);
      } else {
        setNuevaCarrera(prev => ({
          ...prev,
          materias: [...prev.materias, nuevaMateria.trim()]
        }));
      }
      setNuevaMateria('');
    }
  };

  const eliminarMateria = (index: number, esNueva: boolean = false) => {
    if (esNueva) {
      setNuevaCarrera(prev => ({
        ...prev,
        materias: prev.materias.filter((_, i) => i !== index)
      }));
    } else if (carreraEditando) {
      const materiasActualizadas = carreraEditando.materias.filter((_, i) => i !== index);
      setCarreraEditando(prev => prev ? { ...prev, materias: materiasActualizadas } : null);
    }
  };

  // SISTEMA DE ETIQUETAS PARA BENEFICIOS - CORREGIDO CON TIPOS
  const agregarBeneficio = (esNueva: boolean = false) => {
    if (esNueva ? nuevoBeneficio.trim() : nuevoBeneficio.trim()) {
      if (carreraEditando) {
        const beneficiosActualizados = [...carreraEditando.beneficios, nuevoBeneficio.trim()];
        setCarreraEditando(prev => prev ? { ...prev, beneficios: beneficiosActualizados } : null);
      } else {
        setNuevaCarrera(prev => ({
          ...prev,
          beneficios: [...prev.beneficios, nuevoBeneficio.trim()]
        }));
      }
      setNuevoBeneficio('');
    }
  };

  const eliminarBeneficio = (index: number, esNueva: boolean = false) => {
    if (esNueva) {
      setNuevaCarrera(prev => ({
        ...prev,
        beneficios: prev.beneficios.filter((_, i) => i !== index)
      }));
    } else if (carreraEditando) {
      const beneficiosActualizados = carreraEditando.beneficios.filter((_, i) => i !== index);
      setCarreraEditando(prev => prev ? { ...prev, beneficios: beneficiosActualizados } : null);
    }
  };

  // SISTEMA DE ETIQUETAS PARA REQUISITOS - CORREGIDO CON TIPOS
  const agregarRequisito = (esNueva: boolean = false) => {
    if (esNueva ? nuevoRequisito.trim() : nuevoRequisito.trim()) {
      if (carreraEditando) {
        const requisitosActualizados = [...carreraEditando.requisitos, nuevoRequisito.trim()];
        setCarreraEditando(prev => prev ? { ...prev, requisitos: requisitosActualizados } : null);
      } else {
        setNuevaCarrera(prev => ({
          ...prev,
          requisitos: [...prev.requisitos, nuevoRequisito.trim()]
        }));
      }
      setNuevoRequisito('');
    }
  };

  const eliminarRequisito = (index: number, esNueva: boolean = false) => {
    if (esNueva) {
      setNuevaCarrera(prev => ({
        ...prev,
        requisitos: prev.requisitos.filter((_, i) => i !== index)
      }));
    } else if (carreraEditando) {
      const requisitosActualizados = carreraEditando.requisitos.filter((_, i) => i !== index);
      setCarreraEditando(prev => prev ? { ...prev, requisitos: requisitosActualizados } : null);
    }
  };

  // ACTUALIZAR ICONOS INTERACTIVOS - CORREGIDO CON TIPOS
  const actualizarIconoInteractivo = (index: number, campo: keyof IconoInteractivo, valor: string, esNueva: boolean = false) => {
    if (esNueva) {
      setNuevaCarrera(prev => {
        const nuevosIconos = [...prev.iconosInteractivos];
        nuevosIconos[index] = { ...nuevosIconos[index], [campo]: valor };
        return { ...prev, iconosInteractivos: nuevosIconos };
      });
    } else if (carreraEditando) {
      setCarreraEditando(prev => {
        if (!prev) return null;
        const nuevosIconos = [...prev.iconosInteractivos];
        nuevosIconos[index] = { ...nuevosIconos[index], [campo]: valor };
        return { ...prev, iconosInteractivos: nuevosIconos };
      });
    }
  };

  // MANEJAR ENTER PARA AGREGAR ETIQUETAS - NUEVA FUNCIÓN
  const manejarEnter = (e: React.KeyboardEvent, tipo: 'materia' | 'beneficio' | 'requisito', esNueva: boolean = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (tipo) {
        case 'materia':
          agregarMateria(esNueva);
          break;
        case 'beneficio':
          agregarBeneficio(esNueva);
          break;
        case 'requisito':
          agregarRequisito(esNueva);
          break;
      }
    }
  };

  // GUARDAR CARRERA EDITADA - CORREGIDA
  const guardarCarreraEditada = async () => {
    if (carreraEditando) {
      setGuardando(true);
      try {
        const success = await carrerasStorage.updateCarrera(carreraEditando.id, carreraEditando);
        if (success) {
          cargarDatos();
          setCarreraEditando(null);
          alert('Carrera actualizada correctamente');
        } else {
          alert('Error al actualizar la carrera');
        }
      } catch (error) {
        console.error('Error guardando carrera:', error);
        alert('Error al guardar los cambios');
      } finally {
        setGuardando(false);
      }
    }
  };

  // AGREGAR NUEVA CARRERA - CORREGIDA
  const agregarNuevaCarrera = async () => {
    if (!nuevaCarrera.nombre.trim()) {
      alert('Por favor, ingresa el nombre de la carrera');
      return;
    }

    setGuardando(true);
    try {
      const nuevoId = Math.max(...carreras.map(c => c.id), 0) + 1;
      
      const carreraCompleta: Omit<Carrera, 'id'> = {
        ...nuevaCarrera,
        activo: true,
        orden: carreras.length + 1
      };

      const success = await carrerasStorage.addCarrera(carreraCompleta);
      if (success) {
        cargarDatos();
        setMostrarFormulario(false);
        // Resetear formulario
        setNuevaCarrera({
          nombre: '',
          duracion: '',
          estudiantes: '',
          area: 'Técnica',
          descripcion: '',
          descripcionCompleta: '',
          icono: 'GraduationCap',
          color: 'from-[#7D8A6E] to-[#657057]',
          bgColor: 'from-[#9CA98C]/10 to-[#7D8A6E]/5',
          iconosInteractivos: [
            { icono: 'Book', tooltip: 'Educación', color: 'text-[#7D8A6E]' },
            { icono: 'Users', tooltip: 'Social', color: 'text-[#657057]' },
            { icono: 'Star', tooltip: 'Calidad', color: 'text-[#9CA98C]' },
            { icono: 'Award', tooltip: 'Logros', color: 'text-[#434343]' }
          ],
          materias: [],
          beneficios: [],
          requisitos: [],
          imagenes: []
        });
        alert('Carrera agregada correctamente');
      } else {
        alert('Error al agregar la carrera');
      }
    } catch (error) {
      console.error('Error agregando carrera:', error);
      alert('Error al agregar la carrera');
    } finally {
      setGuardando(false);
    }
  };

  // ELIMINAR CARRERA - CORREGIDA
  const eliminarCarrera = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      try {
        const success = await carrerasStorage.deleteCarrera(id);
        if (success) {
          cargarDatos();
          alert('Carrera eliminada correctamente');
        } else {
          alert('Error al eliminar la carrera');
        }
      } catch (error) {
        console.error('Error eliminando carrera:', error);
        alert('Error al eliminar la carrera');
      }
    }
  };

  // ELIMINAR IMAGEN - CORREGIDA CON TIPOS
  const eliminarImagen = async (carreraId: number, index: number) => {
    try {
      const success = await carrerasStorage.eliminarImagenCarrera(carreraId, index);
      if (success) {
        if (carreraEditando && carreraEditando.id === carreraId) {
          const carreraActual = carrerasStorage.getCarreraById(carreraId);
          if (carreraActual) {
            setCarreraEditando(carreraActual);
          }
        }
        cargarDatos();
        alert('Imagen eliminada correctamente');
      }
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };

  // Mover carrera (orden) - CORREGIDA CON TIPOS
  const moverCarrera = async (id: number, direccion: 'arriba' | 'abajo') => {
    const index = carreras.findIndex(c => c.id === id);
    if (index === -1) return;

    const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= carreras.length) return;

    const nuevasCarreras = [...carreras];
    [nuevasCarreras[index], nuevasCarreras[nuevoIndex]] = 
    [nuevasCarreras[nuevoIndex], nuevasCarreras[index]];
    
    // Actualizar órdenes
    nuevasCarreras.forEach((carrera, idx) => {
      carrera.orden = idx;
    });

    // Guardar nuevo orden
    const idsOrdenados = nuevasCarreras.map(c => c.id);
    try {
      const success = await carrerasStorage.reordenarCarreras(idsOrdenados);
      if (success) {
        setCarreras(nuevasCarreras);
      }
    } catch (error) {
      console.error('Error reordenando carreras:', error);
      alert('Error al reordenar las carreras');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando administración de carreras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/blog/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Administración de Carreras
              </h1>
              <p className="text-gray-600">
                Gestiona la información de los programas educativos
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/carreras'}
                className="flex items-center gap-2 px-4 py-2 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Página Pública
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Carrera
              </button>
            </div>
          </div>
        </motion.div>

        {/* Formulario para nueva carrera */}
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-dashed border-gray-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Carrera</h2>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Columna 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={nuevaCarrera.nombre}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: BTP en Informática, Pre-school, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración *
                  </label>
                  <input
                    type="text"
                    value={nuevaCarrera.duracion}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, duracion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 3 años, 1 año, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estudiantes *
                  </label>
                  <input
                    type="text"
                    value={nuevaCarrera.estudiantes}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, estudiantes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 150+, 50+, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área *
                  </label>
                  <select
                    value={nuevaCarrera.area}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {areasDisponibles.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Columna 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono Principal
                  </label>
                  <select
                    value={nuevaCarrera.icono}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, icono: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {iconosDisponibles.map((icono) => (
                      <option key={icono} value={icono}>{icono}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Principal
                  </label>
                  <select
                    value={nuevaCarrera.color}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {coloresMap.map((color, index) => (
                      <option key={index} value={color}>
                        Color {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Fondo
                  </label>
                  <input
                    type="text"
                    value={nuevaCarrera.bgColor}
                    onChange={(e) => setNuevaCarrera(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: from-[#9CA98C]/10 to-[#7D8A6E]/5"
                  />
                </div>
              </div>

              {/* Campos de ancho completo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <textarea
                  value={nuevaCarrera.descripcion}
                  onChange={(e) => setNuevaCarrera(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción breve que aparece en la tarjeta..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa *
                </label>
                <textarea
                  value={nuevaCarrera.descripcionCompleta}
                  onChange={(e) => setNuevaCarrera(prev => ({ ...prev, descripcionCompleta: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada que aparece en la página individual..."
                />
              </div>

              {/* Iconos Interactivos */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Iconos Interactivos
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nuevaCarrera.iconosInteractivos.map((icono, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex gap-2 mb-2">
                        <select
                          value={icono.icono}
                          onChange={(e) => {
                            const nuevosIconos = [...nuevaCarrera.iconosInteractivos];
                            nuevosIconos[index] = { ...nuevosIconos[index], icono: e.target.value };
                            setNuevaCarrera(prev => ({ ...prev, iconosInteractivos: nuevosIconos }));
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {iconosDisponibles.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={icono.tooltip}
                          onChange={(e) => {
                            const nuevosIconos = [...nuevaCarrera.iconosInteractivos];
                            nuevosIconos[index] = { ...nuevosIconos[index], tooltip: e.target.value };
                            setNuevaCarrera(prev => ({ ...prev, iconosInteractivos: nuevosIconos }));
                          }}
                          placeholder="Tooltip"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        value={icono.color}
                        onChange={(e) => {
                          const nuevosIconos = [...nuevaCarrera.iconosInteractivos];
                          nuevosIconos[index] = { ...nuevosIconos[index], color: e.target.value };
                          setNuevaCarrera(prev => ({ ...prev, iconosInteractivos: nuevosIconos }));
                        }}
                        placeholder="Color CSS"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sistema de etiquetas para materias, beneficios y requisitos */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materias
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevaMateria}
                      onChange={(e) => setNuevaMateria(e.target.value)}
                      onKeyPress={(e) => manejarEnter(e, 'materia', true)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nueva materia"
                    />
                    <button
                      onClick={() => agregarMateria(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevaCarrera.materias.map((materia: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {materia}
                        <button
                          onClick={() => eliminarMateria(index, true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficios
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoBeneficio}
                      onChange={(e) => setNuevoBeneficio(e.target.value)}
                      onKeyPress={(e) => manejarEnter(e, 'beneficio', true)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nuevo beneficio"
                    />
                    <button
                      onClick={() => agregarBeneficio(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevaCarrera.beneficios.map((beneficio: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {beneficio}
                        <button
                          onClick={() => eliminarBeneficio(index, true)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requisitos
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoRequisito}
                      onChange={(e) => setNuevoRequisito(e.target.value)}
                      onKeyPress={(e) => manejarEnter(e, 'requisito', true)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nuevo requisito"
                    />
                    <button
                      onClick={() => agregarRequisito(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevaCarrera.requisitos.map((requisito: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                        {requisito}
                        <button
                          onClick={() => eliminarRequisito(index, true)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de agregar */}
              <div className="md:col-span-2">
                <button
                  onClick={agregarNuevaCarrera}
                  disabled={!nuevaCarrera.nombre || !nuevaCarrera.duracion || !nuevaCarrera.estudiantes || !nuevaCarrera.descripcion || !nuevaCarrera.descripcionCompleta || guardando}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {guardando ? 'Agregando...' : 'Agregar Carrera'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de carreras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Lista de Carreras ({carreras.length})
          </h2>

          <div className="space-y-4">
            {carreras.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No hay carreras registradas</p>
                <p className="text-sm">Agrega la primera carrera haciendo clic en el botón "Agregar Carrera"</p>
              </div>
            ) : (
              carreras.map((carrera, index) => (
                <motion.div
                  key={carrera.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    carreraEditando?.id === carrera.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {carreraEditando?.id === carrera.id ? (
                    // FORMULARIO DE EDICIÓN
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Columna 1 - Información básica */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre *
                            </label>
                            <input
                              type="text"
                              value={carreraEditando.nombre}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duración *
                            </label>
                            <input
                              type="text"
                              value={carreraEditando.duracion}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, duracion: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estudiantes *
                            </label>
                            <input
                              type="text"
                              value={carreraEditando.estudiantes}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, estudiantes: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Área *
                            </label>
                            <select
                              value={carreraEditando.area}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, area: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              {areasDisponibles.map((area) => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Columna 2 - Información adicional */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Icono Principal
                            </label>
                            <select
                              value={carreraEditando.icono}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, icono: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              {iconosDisponibles.map((icono) => (
                                <option key={icono} value={icono}>{icono}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color Principal
                            </label>
                            <select
                              value={carreraEditando.color}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, color: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              {coloresMap.map((color, index) => (
                                <option key={index} value={color}>
                                  Color {index + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color de Fondo
                            </label>
                            <input
                              type="text"
                              value={carreraEditando.bgColor}
                              onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, bgColor: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Campos de ancho completo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción Corta *
                        </label>
                        <textarea
                          value={carreraEditando.descripcion}
                          onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, descripcion: e.target.value } : null)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción Completa *
                        </label>
                        <textarea
                          value={carreraEditando.descripcionCompleta}
                          onChange={(e) => setCarreraEditando(prev => prev ? { ...prev, descripcionCompleta: e.target.value } : null)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Iconos Interactivos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Iconos Interactivos
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {carreraEditando.iconosInteractivos.map((icono: IconoInteractivo, index: number) => (
                            <div key={index} className="border border-gray-300 rounded-lg p-4">
                              <div className="flex gap-2 mb-2">
                                <select
                                  value={icono.icono}
                                  onChange={(e) => actualizarIconoInteractivo(index, 'icono', e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                  {iconosDisponibles.map((icon) => (
                                    <option key={icon} value={icon}>{icon}</option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={icono.tooltip}
                                  onChange={(e) => actualizarIconoInteractivo(index, 'tooltip', e.target.value)}
                                  placeholder="Tooltip"
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <input
                                type="text"
                                value={icono.color}
                                onChange={(e) => actualizarIconoInteractivo(index, 'color', e.target.value)}
                                placeholder="Color CSS"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Imágenes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Imágenes de la Carrera
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {carreraEditando.imagenes.map((imagen: string, index: number) => (
                            <div key={index} className="relative">
                              <img 
                                src={imagen} 
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <button
                                onClick={() => eliminarImagen(carreraEditando.id, index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => subirImagen(e, carreraEditando.id)}
                              className="hidden"
                              id={`carrera-imagen-${carreraEditando.id}`}
                              disabled={subiendoImagen === `carrera-${carreraEditando.id}-new`}
                            />
                            <label htmlFor={`carrera-imagen-${carreraEditando.id}`} className="cursor-pointer">
                              {subiendoImagen === `carrera-${carreraEditando.id}-new` ? (
                                <div className="flex flex-col items-center">
                                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                                  <p className="text-xs text-gray-600">Subiendo...</p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-600">Agregar imagen</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Sistema de etiquetas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Materias
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevaMateria}
                              onChange={(e) => setNuevaMateria(e.target.value)}
                              onKeyPress={(e) => manejarEnter(e, 'materia')}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nueva materia"
                            />
                            <button
                              onClick={() => agregarMateria()}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {carreraEditando.materias.map((materia: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {materia}
                                <button
                                  onClick={() => eliminarMateria(index)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beneficios
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevoBeneficio}
                              onChange={(e) => setNuevoBeneficio(e.target.value)}
                              onKeyPress={(e) => manejarEnter(e, 'beneficio')}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nuevo beneficio"
                            />
                            <button
                              onClick={() => agregarBeneficio()}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {carreraEditando.beneficios.map((beneficio: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {beneficio}
                                <button
                                  onClick={() => eliminarBeneficio(index)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requisitos
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevoRequisito}
                              onChange={(e) => setNuevoRequisito(e.target.value)}
                              onKeyPress={(e) => manejarEnter(e, 'requisito')}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nuevo requisito"
                            />
                            <button
                              onClick={() => agregarRequisito()}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {carreraEditando.requisitos.map((requisito: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                {requisito}
                                <button
                                  onClick={() => eliminarRequisito(index)}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={guardarCarreraEditada}
                          disabled={!carreraEditando.nombre || !carreraEditando.duracion || !carreraEditando.estudiantes || !carreraEditando.descripcion || !carreraEditando.descripcionCompleta || guardando}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                          onClick={() => setCarreraEditando(null)}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VISTA NORMAL DE LA CARRERA
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-16 h-16 bg-gradient-to-br ${carrera.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-sm">
                            {carrera.icono.substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{carrera.nombre}</h3>
                          <p className="text-sm text-gray-600">{carrera.area}</p>
                          <p className="text-xs text-gray-500">{carrera.duracion} • {carrera.estudiantes}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {carrera.materias.slice(0, 2).map((materia: string, idx: number) => (
                              <span key={idx} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                                {materia}
                              </span>
                            ))}
                            {carrera.materias.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                                +{carrera.materias.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moverCarrera(carrera.id, 'arriba')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moverCarrera(carrera.id, 'abajo')}
                          disabled={index === carreras.length - 1}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCarreraEditando(carrera)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarCarrera(carrera.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}