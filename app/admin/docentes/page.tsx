// app/admin/docentes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X,
  Users,
  GraduationCap,
  ArrowLeft,
  BookOpen,
  Award,
  Trophy,
  Briefcase,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { docentesStorage } from '@/lib/docentesStorage';
import { Docente, Fundador } from '@/types/docente';

const iconosMap: { [key: string]: string } = {
  'Users': 'Users',
  'BookOpen': 'BookOpen', 
  'GraduationCap': 'GraduationCap',
  'Award': 'Award',
  'Trophy': 'Trophy',
  'Briefcase': 'Briefcase'
};

const coloresMap = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-amber-400',
  'from-red-500 to-rose-400',
  'from-indigo-500 to-violet-400',
];

export default function AdminDocentes() {
  const router = useRouter();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [fundador, setFundador] = useState<Fundador | null>(null);
  const [docenteEditando, setDocenteEditando] = useState<Docente | null>(null);
  const [editandoFundador, setEditandoFundador] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estado para nuevo docente con TODOS los campos
  const [nuevoDocente, setNuevoDocente] = useState<Omit<Docente, 'id' | 'activo' | 'orden'>>({
    nombre: '',
    titulo: '',
    formacion: [],
    materias: [],
    experiencia: '',
    especialidad: '',
    icono: 'Users',
    foto: '',
    color: 'from-blue-500 to-cyan-400',
    descripcionCompleta: '',
    logros: [],
    contacto: ''
  });

  const [nuevaMateria, setNuevaMateria] = useState('');
  const [nuevaFormacion, setNuevaFormacion] = useState('');
  const [nuevoLogro, setNuevoLogro] = useState('');
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
      const docentesData = docentesStorage.getDocentes();
      const fundadorData = docentesStorage.getFundador();
      
      setDocentes(docentesData);
      setFundador(fundadorData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos de docentes');
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN SUBIR IMAGEN - EXACTAMENTE IGUAL PARA FUNDADOR Y DOCENTES
  const subirImagen = async (event: React.ChangeEvent<HTMLInputElement>, tipo: 'docente' | 'fundador', id?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    setSubiendoImagen(tipo === 'fundador' ? 'fundador' : `docente-${id}`);
    
    try {
      // Convertir archivo a Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const imagenBase64 = reader.result as string;
        
        try {
          if (tipo === 'fundador') {
            const success = await docentesStorage.updateFundador({ foto: imagenBase64 });
            if (success) {
              setFundador(prev => prev ? { ...prev, foto: imagenBase64 } : null);
              alert('Imagen del fundador actualizada correctamente');
            }
          } else if (tipo === 'docente' && id) {
            const success = await docentesStorage.updateDocente(id, { foto: imagenBase64 });
            if (success) {
              // Actualizar estado local si estamos editando este docente
              if (docenteEditando && docenteEditando.id === id) {
                setDocenteEditando(prev => prev ? { ...prev, foto: imagenBase64 } : null);
              }
              // Recargar lista de docentes
              cargarDatos();
              alert('Imagen del docente actualizada correctamente');
            }
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

  // SISTEMA DE ETIQUETAS PARA FORMACIÓN
  const agregarFormacion = () => {
    if (nuevaFormacion.trim()) {
      if (docenteEditando) {
        const formacionActualizada = [...docenteEditando.formacion, nuevaFormacion.trim()];
        setDocenteEditando(prev => prev ? { ...prev, formacion: formacionActualizada } : null);
      } else {
        setNuevoDocente(prev => ({
          ...prev,
          formacion: [...prev.formacion, nuevaFormacion.trim()]
        }));
      }
      setNuevaFormacion('');
    }
  };

  const eliminarFormacion = (index: number, esNuevo: boolean = false) => {
    if (esNuevo) {
      setNuevoDocente(prev => ({
        ...prev,
        formacion: prev.formacion.filter((_, i) => i !== index)
      }));
    } else if (docenteEditando) {
      const formacionActualizada = docenteEditando.formacion.filter((_, i) => i !== index);
      setDocenteEditando(prev => prev ? { ...prev, formacion: formacionActualizada } : null);
    }
  };

  // SISTEMA DE ETIQUETAS PARA MATERIAS
  const agregarMateria = () => {
    if (nuevaMateria.trim()) {
      if (docenteEditando) {
        const materiasActualizadas = [...docenteEditando.materias, nuevaMateria.trim()];
        setDocenteEditando(prev => prev ? { ...prev, materias: materiasActualizadas } : null);
      } else {
        setNuevoDocente(prev => ({
          ...prev,
          materias: [...prev.materias, nuevaMateria.trim()]
        }));
      }
      setNuevaMateria('');
    }
  };

  const eliminarMateria = (index: number, esNuevo: boolean = false) => {
    if (esNuevo) {
      setNuevoDocente(prev => ({
        ...prev,
        materias: prev.materias.filter((_, i) => i !== index)
      }));
    } else if (docenteEditando) {
      const materiasActualizadas = docenteEditando.materias.filter((_, i) => i !== index);
      setDocenteEditando(prev => prev ? { ...prev, materias: materiasActualizadas } : null);
    }
  };

  // SISTEMA DE ETIQUETAS PARA LOGROS
  const agregarLogro = () => {
    if (nuevoLogro.trim()) {
      if (docenteEditando) {
        const logrosActualizados = [...docenteEditando.logros, nuevoLogro.trim()];
        setDocenteEditando(prev => prev ? { ...prev, logros: logrosActualizados } : null);
      } else {
        setNuevoDocente(prev => ({
          ...prev,
          logros: [...prev.logros, nuevoLogro.trim()]
        }));
      }
      setNuevoLogro('');
    }
  };

  const eliminarLogro = (index: number, esNuevo: boolean = false) => {
    if (esNuevo) {
      setNuevoDocente(prev => ({
        ...prev,
        logros: prev.logros.filter((_, i) => i !== index)
      }));
    } else if (docenteEditando) {
      const logrosActualizados = docenteEditando.logros.filter((_, i) => i !== index);
      setDocenteEditando(prev => prev ? { ...prev, logros: logrosActualizados } : null);
    }
  };

  // GUARDAR DOCENTE EDITADO
  const guardarDocenteEditado = async () => {
    if (docenteEditando) {
      setGuardando(true);
      try {
        const success = await docentesStorage.updateDocente(docenteEditando.id, docenteEditando);
        if (success) {
          cargarDatos();
          setDocenteEditando(null);
          alert('Docente actualizado correctamente');
        } else {
          alert('Error al actualizar el docente');
        }
      } catch (error) {
        console.error('Error guardando docente:', error);
        alert('Error al guardar los cambios');
      } finally {
        setGuardando(false);
      }
    }
  };

  // AGREGAR NUEVO DOCENTE COMPLETO
  const agregarNuevoDocente = async () => {
    setGuardando(true);
    try {
      const nuevoId = Math.max(...docentes.map(d => d.id), 0) + 1;
      
      const docenteCompleto: Omit<Docente, 'id'> = {
        ...nuevoDocente,
        activo: true,
        orden: docentes.length + 1
      };

      const success = await docentesStorage.addDocente(docenteCompleto);
      if (success) {
        cargarDatos();
        setMostrarFormulario(false);
        // Resetear formulario
        setNuevoDocente({
          nombre: '',
          titulo: '',
          formacion: [],
          materias: [],
          experiencia: '',
          especialidad: '',
          icono: 'Users',
          foto: '',
          color: 'from-blue-500 to-cyan-400',
          descripcionCompleta: '',
          logros: [],
          contacto: ''
        });
        alert('Docente agregado correctamente');
      } else {
        alert('Error al agregar el docente');
      }
    } catch (error) {
      console.error('Error agregando docente:', error);
      alert('Error al agregar el docente');
    } finally {
      setGuardando(false);
    }
  };

  // ELIMINAR DOCENTE
  const eliminarDocente = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este docente?')) {
      try {
        const success = await docentesStorage.deleteDocente(id);
        if (success) {
          cargarDatos();
          alert('Docente eliminado correctamente');
        } else {
          alert('Error al eliminar el docente');
        }
      } catch (error) {
        console.error('Error eliminando docente:', error);
        alert('Error al eliminar el docente');
      }
    }
  };

  // ACTUALIZAR FUNDADOR
  const actualizarFundador = async (campo: string, valor: string) => {
    if (!fundador) return;
    
    setGuardando(true);
    try {
      const fundadorActualizado = { ...fundador, [campo]: valor };
      const success = await docentesStorage.updateFundador(fundadorActualizado);
      if (success) {
        setFundador(fundadorActualizado);
      }
    } catch (error) {
      console.error('Error actualizando fundador:', error);
      alert('Error al actualizar la información');
    } finally {
      setGuardando(false);
    }
  };

  // Mover docente (orden)
  const moverDocente = async (id: number, direccion: 'arriba' | 'abajo') => {
    const index = docentes.findIndex(d => d.id === id);
    if (index === -1) return;

    const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= docentes.length) return;

    const nuevosDocentes = [...docentes];
    [nuevosDocentes[index], nuevosDocentes[nuevoIndex]] = 
    [nuevosDocentes[nuevoIndex], nuevosDocentes[index]];
    
    // Actualizar órdenes
    nuevosDocentes.forEach((docente, idx) => {
      docente.orden = idx;
    });

    // Guardar nuevo orden
    const idsOrdenados = nuevosDocentes.map(d => d.id);
    try {
      const success = await docentesStorage.reordenarDocentes(idsOrdenados);
      if (success) {
        setDocentes(nuevosDocentes);
      }
    } catch (error) {
      console.error('Error reordenando docentes:', error);
      alert('Error al reordenar los docentes');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando administración de docentes...</p>
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
                Administración de Docentes
              </h1>
              <p className="text-gray-600">
                Gestiona la información del equipo docente y del fundador
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/docentes'}
                className="flex items-center gap-2 px-4 py-2 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Página Pública
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sección Fundador */}
        {fundador && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Información del Fundador</h2>
              <button
                onClick={() => setEditandoFundador(!editandoFundador)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {editandoFundador ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editandoFundador ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto del Fundador
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => subirImagen(e, 'fundador')}
                      className="hidden"
                      id="fundador-foto"
                      disabled={subiendoImagen === 'fundador'}
                    />
                    <label htmlFor="fundador-foto" className="cursor-pointer">
                      {subiendoImagen === 'fundador' ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-600">Subiendo imagen...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Haz clic para subir imagen</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP (Máx. 2MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {fundador.foto && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <img 
                        src={fundador.foto} 
                        alt="Fundador" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={fundador.nombre}
                      onChange={(e) => actualizarFundador('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={fundador.titulo}
                      onChange={(e) => actualizarFundador('titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={fundador.descripcion}
                      onChange={(e) => actualizarFundador('descripcion', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-300 rounded-xl overflow-hidden">
                    {fundador.foto ? (
                      <img 
                        src={fundador.foto} 
                        alt={fundador.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Users className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900">{fundador.nombre}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{fundador.titulo}</p>
                  <p className="text-gray-600 mb-4">{fundador.descripcion}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Sección Docentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Lista de Docentes ({docentes.length})
            </h2>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Docente
            </button>
          </div>

          {/* Formulario para nuevo docente COMPLETO */}
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-dashed border-gray-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Nuevo Docente</h3>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Columna 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={nuevoDocente.nombre}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Lic. Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={nuevoDocente.titulo}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Docente de Matemáticas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiencia *
                    </label>
                    <input
                      type="text"
                      value={nuevoDocente.experiencia}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, experiencia: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 10+ años"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad *
                    </label>
                    <input
                      type="text"
                      value={nuevoDocente.especialidad}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, especialidad: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Ciencias Exactas"
                    />
                  </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icono
                    </label>
                    <select
                      value={nuevoDocente.icono}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, icono: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Users">👥 Users</option>
                      <option value="BookOpen">📚 BookOpen</option>
                      <option value="GraduationCap">🎓 GraduationCap</option>
                      <option value="Award">🏆 Award</option>
                      <option value="Trophy">🏅 Trophy</option>
                      <option value="Briefcase">💼 Briefcase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      value={nuevoDocente.color}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, color: e.target.value }))}
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
                      Información de Contacto
                    </label>
                    <input
                      type="text"
                      value={nuevoDocente.contacto}
                      onChange={(e) => setNuevoDocente(prev => ({ ...prev, contacto: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Disponible para consultas los martes y jueves"
                    />
                  </div>
                </div>

                {/* Campos de ancho completo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil Profesional *
                  </label>
                  <textarea
                    value={nuevoDocente.descripcionCompleta}
                    onChange={(e) => setNuevoDocente(prev => ({ ...prev, descripcionCompleta: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción detallada del perfil profesional del docente..."
                  />
                </div>

                {/* Formación con etiquetas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formación Académica
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevaFormacion}
                        onChange={(e) => setNuevaFormacion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarFormacion())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nueva formación académica"
                      />
                      <button
                        onClick={agregarFormacion}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nuevoDocente.formacion.map((formacion, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {formacion}
                          <button
                            onClick={() => eliminarFormacion(index, true)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Materias con etiquetas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materias que Imparte
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevaMateria}
                        onChange={(e) => setNuevaMateria(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarMateria())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nueva materia"
                      />
                      <button
                        onClick={agregarMateria}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nuevoDocente.materias.map((materia, index) => (
                        <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                          {materia}
                          <button
                            onClick={() => eliminarMateria(index, true)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logros con etiquetas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logros y Reconocimientos
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevoLogro}
                        onChange={(e) => setNuevoLogro(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarLogro())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nuevo logro o reconocimiento"
                      />
                      <button
                        onClick={agregarLogro}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nuevoDocente.logros.map((logro, index) => (
                        <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {logro}
                          <button
                            onClick={() => eliminarLogro(index, true)}
                            className="text-green-600 hover:text-green-800"
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
                    onClick={agregarNuevoDocente}
                    disabled={!nuevoDocente.nombre || !nuevoDocente.titulo || !nuevoDocente.descripcionCompleta || guardando}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {guardando ? 'Agregando...' : 'Agregar Docente'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lista de docentes */}
          <div className="space-y-4">
            {docentes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No hay docentes registrados</p>
                <p className="text-sm">Agrega el primer docente haciendo clic en el botón "Agregar Docente"</p>
              </div>
            ) : (
              docentes.map((docente, index) => (
                <motion.div
                  key={docente.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    docenteEditando?.id === docente.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {docenteEditando?.id === docente.id ? (
                    // FORMULARIO DE EDICIÓN COMPLETO
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Columna 1 - Información básica */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Foto
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => subirImagen(e, 'docente', docente.id)}
                                className="hidden"
                                id={`docente-foto-${docente.id}`}
                                disabled={subiendoImagen === `docente-${docente.id}`}
                              />
                              <label htmlFor={`docente-foto-${docente.id}`} className="cursor-pointer">
                                {subiendoImagen === `docente-${docente.id}` ? (
                                  <div className="flex flex-col items-center">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                                    <p className="text-xs text-gray-600">Subiendo...</p>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                    <p className="text-xs text-gray-600">Cambiar imagen</p>
                                  </>
                                )}
                              </label>
                            </div>
                            
                            {docenteEditando.foto && (
                              <div className="mt-2">
                                <img 
                                  src={docenteEditando.foto} 
                                  alt="Vista previa" 
                                  className="w-20 h-20 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre *
                            </label>
                            <input
                              type="text"
                              value={docenteEditando.nombre}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Título *
                            </label>
                            <input
                              type="text"
                              value={docenteEditando.titulo}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, titulo: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Experiencia *
                            </label>
                            <input
                              type="text"
                              value={docenteEditando.experiencia}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, experiencia: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Columna 2 - Información adicional */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Especialidad *
                            </label>
                            <input
                              type="text"
                              value={docenteEditando.especialidad}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, especialidad: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Icono
                            </label>
                            <select
                              value={docenteEditando.icono}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, icono: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Users">👥 Users</option>
                              <option value="BookOpen">📚 BookOpen</option>
                              <option value="GraduationCap">🎓 GraduationCap</option>
                              <option value="Award">🏆 Award</option>
                              <option value="Trophy">🏅 Trophy</option>
                              <option value="Briefcase">💼 Briefcase</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color
                            </label>
                            <select
                              value={docenteEditando.color}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, color: e.target.value } : null)}
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
                              Información de Contacto
                            </label>
                            <input
                              type="text"
                              value={docenteEditando.contacto}
                              onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, contacto: e.target.value } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Campos de ancho completo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Perfil Profesional *
                        </label>
                        <textarea
                          value={docenteEditando.descripcionCompleta}
                          onChange={(e) => setDocenteEditando(prev => prev ? { ...prev, descripcionCompleta: e.target.value } : null)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Formación con etiquetas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formación Académica
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevaFormacion}
                              onChange={(e) => setNuevaFormacion(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarFormacion())}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nueva formación académica"
                            />
                            <button
                              onClick={agregarFormacion}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {docenteEditando.formacion.map((formacion, index) => (
                              <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {formacion}
                                <button
                                  onClick={() => eliminarFormacion(index)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Materias con etiquetas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Materias que Imparte
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevaMateria}
                              onChange={(e) => setNuevaMateria(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarMateria())}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nueva materia"
                            />
                            <button
                              onClick={agregarMateria}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {docenteEditando.materias.map((materia, index) => (
                              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                {materia}
                                <button
                                  onClick={() => eliminarMateria(index)}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Logros con etiquetas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logros y Reconocimientos
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={nuevoLogro}
                              onChange={(e) => setNuevoLogro(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarLogro())}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nuevo logro o reconocimiento"
                            />
                            <button
                              onClick={agregarLogro}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {docenteEditando.logros.map((logro, index) => (
                              <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {logro}
                                <button
                                  onClick={() => eliminarLogro(index)}
                                  className="text-green-600 hover:text-green-800"
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
                          onClick={guardarDocenteEditado}
                          disabled={!docenteEditando.nombre || !docenteEditando.titulo || !docenteEditando.descripcionCompleta || guardando}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                          onClick={() => setDocenteEditando(null)}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VISTA NORMAL DEL DOCENTE
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                          {docente.foto ? (
                            <img 
                              src={docente.foto} 
                              alt={docente.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{docente.nombre}</h3>
                          <p className="text-sm text-gray-600">{docente.titulo}</p>
                          <p className="text-xs text-gray-500">{docente.especialidad} • {docente.experiencia}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {docente.materias.slice(0, 2).map((materia, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                                {materia}
                              </span>
                            ))}
                            {docente.materias.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                                +{docente.materias.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moverDocente(docente.id, 'arriba')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moverDocente(docente.id, 'abajo')}
                          disabled={index === docentes.length - 1}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDocenteEditando(docente)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarDocente(docente.id)}
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