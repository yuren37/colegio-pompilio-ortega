'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, CheckCircle2, Play, Target, GraduationCap, Zap, BookOpen, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { carrerasStorage } from '@/lib/carrerasStorage';
import { useState, useEffect } from 'react';

// Mapeo de iconos para convertir strings a componentes
const iconosMap: { [key: string]: React.ComponentType<any> } = {
  'Cpu': require('lucide-react').Cpu,
  'Atom': require('lucide-react').Atom,
  'Book': require('lucide-react').Book,
  'Code': require('lucide-react').Code,
  'Database': require('lucide-react').Database,
  'Network': require('lucide-react').Network,
  'Server': require('lucide-react').Server,
  'Brain': require('lucide-react').Brain,
  'Calculator': require('lucide-react').Calculator,
  'GraduationCap': require('lucide-react').GraduationCap,
  'Users': require('lucide-react').Users,
  'Shield': require('lucide-react').Shield,
  'Sparkles': require('lucide-react').Sparkles,
  'Target': require('lucide-react').Target,
  'Zap': require('lucide-react').Zap,
  'Clock': require('lucide-react').Clock,
  'CheckCircle2': require('lucide-react').CheckCircle2,
  'Laptop': require('lucide-react').Laptop,
  'Microscope': require('lucide-react').Microscope,
  'Palette': require('lucide-react').Palette,
  'Music': require('lucide-react').Music,
  'Dumbbell': require('lucide-react').Dumbbell,
  'Languages': require('lucide-react').Languages,
  'Baby': require('lucide-react').Baby,
  'School': require('lucide-react').School,
  'Flask': require('lucide-react').Flask,
  'BookOpen': require('lucide-react').BookOpen,
  'Globe': require('lucide-react').Globe,
  'Heart': require('lucide-react').Heart
};

export default function CarreraDetail() {
  const params = useParams();
  const carreraId = params.id as string;
  const [carrera, setCarrera] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
  // Estados para la galería premium
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [imagenLightbox, setImagenLightbox] = useState(0);

  useEffect(() => {
    const cargarCarrera = () => {
      try {
        const carreraData = carrerasStorage.getCarreraById(parseInt(carreraId));
        if (carreraData) {
          setCarrera(carreraData);
        }
      } catch (error) {
        console.error('Error cargando carrera:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCarrera();
  }, [carreraId]);

  const goBack = () => {
    window.history.back();
  };

  // Navegación de imágenes
  const siguienteImagen = () => {
    if (carrera?.imagenes) {
      setImagenPrincipal(prev => (prev + 1) % carrera.imagenes.length);
    }
  };

  const anteriorImagen = () => {
    if (carrera?.imagenes) {
      setImagenPrincipal(prev => (prev - 1 + carrera.imagenes.length) % carrera.imagenes.length);
    }
  };

  const siguienteLightbox = () => {
    if (carrera?.imagenes) {
      setImagenLightbox(prev => (prev + 1) % carrera.imagenes.length);
    }
  };

  const anteriorLightbox = () => {
    if (carrera?.imagenes) {
      setImagenLightbox(prev => (prev - 1 + carrera.imagenes.length) % carrera.imagenes.length);
    }
  };

  const abrirLightbox = (index: number) => {
    setImagenLightbox(index);
    setLightboxAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  const cerrarLightbox = () => {
    setLightboxAbierto(false);
    document.body.style.overflow = 'unset';
  };

  // Manejar teclado en lightbox
  useEffect(() => {
    const handleTeclado = (e: KeyboardEvent) => {
      if (!lightboxAbierto) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          anteriorLightbox();
          break;
        case 'ArrowRight':
          siguienteLightbox();
          break;
        case 'Escape':
          cerrarLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleTeclado);
    return () => window.removeEventListener('keydown', handleTeclado);
  }, [lightboxAbierto]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800">Cargando información de la carrera...</p>
        </div>
      </div>
    );
  }

  if (!carrera) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Carrera no encontrada</p>
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-800 hover:text-[#9CA98C] font-bold transition-colors duration-300 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Volver a Carreras
          </button>
        </div>
      </div>
    );
  }

  // Obtener el componente de icono
  const IconoComponente = iconosMap[carrera.icono] || iconosMap['Book'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border-b-2 border-[#9CA98C]/20 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.button
              onClick={goBack}
              whileHover={{ x: -4 }}
              className="flex items-center gap-3 text-gray-800 hover:text-[#9CA98C] font-bold transition-colors duration-300 font-sans"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              Volver a Carreras
            </motion.button>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${carrera.color} flex items-center justify-center shadow-lg`}
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}>
                <IconoComponente className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900 font-serif">{carrera.nombre}</h1>
                <p className="text-gray-700 font-sans">{carrera.area}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería Premium */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Imagen Principal con Controles */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}
            >
              {carrera.imagenes && carrera.imagenes.length > 0 ? (
                <>
                  <motion.img 
                    key={imagenPrincipal}
                    src={carrera.imagenes[imagenPrincipal]} 
                    alt={`${carrera.nombre} ${imagenPrincipal + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => abrirLightbox(imagenPrincipal)}
                  />
                  
                  {/* Botón de ampliar */}
                  <button
                    onClick={() => abrirLightbox(imagenPrincipal)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  
                  {/* Controles de navegación */}
                  {carrera.imagenes.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); anteriorImagen(); }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); siguienteImagen(); }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Indicador de posición */}
                  {carrera.imagenes.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 backdrop-blur-sm bg-black/30 rounded-full p-2">
                      {carrera.imagenes.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={(e) => { e.stopPropagation(); setImagenPrincipal(index); }}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === imagenPrincipal ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Contador */}
                  {carrera.imagenes.length > 1 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                      {imagenPrincipal + 1} / {carrera.imagenes.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xl font-bold">
                  {carrera.nombre}
                </div>
              )}
            </div>
            
            {/* Miniaturas Mejoradas */}
            {carrera.imagenes && carrera.imagenes.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {carrera.imagenes.map((imagen: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${
                      index === imagenPrincipal 
                        ? 'border-[#9CA98C] shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-[#9CA98C] hover:shadow-md'
                    }`}
                    style={{ 
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                    }}
                    onClick={() => setImagenPrincipal(index)}
                  >
                    <img 
                      src={imagen} 
                      alt={`${carrera.nombre} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 ${
                      index === imagenPrincipal ? 'bg-[#9CA98C]/20' : ''
                    }`} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Información */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Descripción */}
            <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif flex items-center gap-3">
                <Play className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                Descripción del Programa
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed text-lg">
                {carrera.descripcionCompleta}
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#F4F1EA] to-[#9CA98C]/20 p-6 rounded-2xl text-center"
                style={{ 
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                }}>
                <Clock className="w-8 h-8 text-[#9CA98C] mx-auto mb-3" strokeWidth={2.5} />
                <p className="text-2xl font-bold text-gray-900 font-serif">{carrera.duracion}</p>
                <p className="text-gray-700 font-sans">Duración</p>
              </div>
              <div className="bg-gradient-to-br from-[#F4F1EA] to-[#9CA98C]/20 p-6 rounded-2xl text-center"
                style={{ 
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                }}>
                <Users className="w-8 h-8 text-[#9CA98C] mx-auto mb-3" strokeWidth={2.5} />
                <p className="text-2xl font-bold text-gray-900 font-serif">{carrera.estudiantes}</p>
                <p className="text-gray-700 font-sans">Estudiantes</p>
              </div>
            </div>

            {/* Materias */}
            <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-3">
                <Target className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                Plan de Estudios
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {carrera.materias.map((materia: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#F4F1EA]/50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-[#9CA98C] flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-gray-800 font-sans text-sm">{materia}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                Beneficios Exclusivos
              </h2>
              <div className="space-y-3">
                {carrera.beneficios.map((beneficio: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#9CA98C] flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-gray-800 font-sans">{beneficio}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requisitos */}
            <div className="bg-gradient-to-br from-[#434343] to-[#666666] text-white p-8 shadow-2xl rounded-2xl"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <h2 className="text-2xl font-bold mb-6 font-serif flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                Requisitos de Ingreso
              </h2>
              <div className="space-y-3">
                {carrera.requisitos.map((req: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#9CA98C] flex-shrink-0" strokeWidth={2.5} />
                    <span className="font-sans">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const message = `Hola, me interesa la carrera de ${carrera.nombre}. ¿Podrían darme más información?`;
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/504TU_NUMERO?text=${encodedMessage}`, '_blank');
              }}
              className="w-full bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E] text-white py-4 font-bold transition-all duration-300 font-sans text-lg shadow-2xl"
              style={{ 
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
              }}
            >
              Solicitar Información por WhatsApp
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Premium */}
      <AnimatePresence>
        {lightboxAbierto && carrera.imagenes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={cerrarLightbox}
          >
            <button
              onClick={cerrarLightbox}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {carrera.imagenes.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); anteriorLightbox(); }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); siguienteLightbox(); }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
              <motion.img
                key={imagenLightbox}
                src={carrera.imagenes[imagenLightbox]}
                alt={`${carrera.nombre} ${imagenLightbox + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {carrera.imagenes.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 backdrop-blur-sm bg-black/50 rounded-full p-3">
                {carrera.imagenes.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setImagenLightbox(index); }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === imagenLightbox ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 text-white text-lg rounded-full backdrop-blur-sm">
              {imagenLightbox + 1} / {carrera.imagenes.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}