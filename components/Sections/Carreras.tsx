'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Clock, Users, ArrowRight, CheckCircle2, X, Target, GraduationCap, Zap } from 'lucide-react';
import { carrerasStorage } from '@/lib/carrerasStorage';

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
  'Zap': require('lucide-react').Zap
};

const areas = ["Todas", "Técnica", "Ciencias", "Básica"];

export default function Carreras() {
  const [carreras, setCarreras] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrera, setSelectedCarrera] = useState<any>(null);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar carreras del storage
  useEffect(() => {
    const cargarCarreras = () => {
      try {
        const carrerasData = carrerasStorage.getCarreras();
        setCarreras(carrerasData);
      } catch (error) {
        console.error('Error cargando carreras:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCarreras();
  }, []);

  // Animación de partículas en el fondo
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 8,
      color: `rgba(156, 169, 140, ${0.08 + Math.random() * 0.15})`
    }));
    setParticles(newParticles);
  }, []);

  // Animación AUTOMÁTICA de iconos
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(iconInterval);
  }, []);

  const filteredCarreras = carreras.filter(carrera => {
    const matchesArea = selectedArea === "Todas" || carrera.area === selectedArea;
    const matchesSearch = carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesSearch;
  });

  const openCarreraDetail = (carrera: any) => {
    setSelectedCarrera(carrera);
    document.body.style.overflow = 'hidden';
  };

  const closeCarreraDetail = () => {
    setSelectedCarrera(null);
    document.body.style.overflow = 'unset';
  };

  const navigateToCarrera = (carreraId: number) => {
    window.location.href = `/carreras/${carreraId}`;
  };

  // Componente de iconos interactivos
  const IconosInteractivos = ({ carrera }: any) => {
    return (
      <div className="flex justify-center gap-3 mb-6">
        {carrera.iconosInteractivos.map((iconData: any, index: number) => {
          const IconComponent = iconosMap[iconData.icono] || iconosMap['Code'];
          const isActive = index === activeIconIndex;
          
          return (
            <motion.div
              key={index}
              className="relative"
            >
              <motion.div
                className={`w-12 h-12 rounded-lg bg-white border flex items-center justify-center shadow-sm ${
                  isActive ? 'border-[#9CA98C] shadow-md bg-[#F8F6F2]' : 'border-[#9CA98C]/30'
                }`}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  y: isActive ? [0, -3, 0] : 0,
                  rotate: isActive ? [0, -5, 5, 0] : 0
                }}
                transition={{
                  duration: 1.5,
                  repeat: isActive ? 1 : 0
                }}
              >
                <IconComponent 
                  className={`w-5 h-5 transition-colors duration-500 ${
                    isActive ? `${iconData.color} opacity-100` : 'text-[#434343] opacity-60'
                  }`}
                />
              </motion.div>

              {/* Tooltip siempre visible para el icono activo */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-[#434343] text-white text-xs rounded whitespace-nowrap z-20 shadow-lg"
                >
                  {iconData.tooltip}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#434343] rotate-45" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (cargando) {
    return (
      <section id="carreras" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#434343]">Cargando programas educativos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="carreras" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] relative overflow-hidden">
        
        {/* ANIMACIÓN DE PARTÍCULAS EN EL FONDO */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-[#9CA98C]"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -150, -300],
                x: [0, (Math.random() - 0.5) * 30, 0],
                opacity: [0, 0.2, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Motion Blur Cristal */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#9CA98C]/15 to-[#7D8A6E]/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#434343]/10 to-[#666666]/5 blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-[#9CA98C]/20"
            >
              <div className="w-2 h-2 bg-[#9CA98C] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#434343] uppercase tracking-wider">
                Oferta Educativa
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#434343] mb-6 font-serif"
            >
              Nuestros <span className="bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] bg-clip-text text-transparent">Programas</span>
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-[#434343]/70 max-w-3xl mx-auto font-sans leading-relaxed"
            >
              Formación académica de excelencia con enfoque en tecnología, ciencias y desarrollo integral
            </motion.p>
          </motion.div>

          {/* Filtros y búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-6 mb-16"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#434343]/40" size={20} />
              <input
                type="text"
                placeholder="Buscar programa educativo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border border-[#9CA98C]/30 focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-2xl shadow-sm"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
              {areas.map((area) => (
                <motion.button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap font-sans rounded-xl ${
                    selectedArea === area
                      ? 'bg-[#434343] text-white shadow-lg'
                      : 'bg-white text-[#434343] border border-[#9CA98C]/30 hover:border-[#9CA98C] hover:shadow-md'
                  }`}
                >
                  {area}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Grid de carreras */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredCarreras.map((carrera, index) => {
              const IconoComponente = iconosMap[carrera.icono] || iconosMap['Book'];
              
              return (
                <motion.div
                  key={carrera.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white border border-[#9CA98C]/20 rounded-2xl p-8 hover:shadow-xl hover:border-[#9CA98C] transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  
                  {/* Efecto de gradiente al hover */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${carrera.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    initial={false}
                  />

                  {/* Icono principal */}
                  <motion.div 
                    className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${carrera.color} rounded-2xl mb-6 shadow-lg`}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <IconoComponente className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Iconos interactivos - AUTOMÁTICOS */}
                  <IconosInteractivos carrera={carrera} />
                  
                  {/* Contenido */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-[#434343] mb-4 font-serif group-hover:text-[#9CA98C] transition-colors duration-300">
                      {carrera.nombre}
                    </h3>
                    
                    <p className="text-[#434343]/70 mb-6 font-sans leading-relaxed">
                      {carrera.descripcion}
                    </p>
                    
                    {/* Información */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-[#9CA98C]/20">
                      <div className="flex items-center gap-3 text-[#434343]/70 font-sans">
                        <Clock className="w-5 h-5 text-[#9CA98C]" />
                        <span className="font-medium">{carrera.duracion}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#434343]/70 font-sans">
                        <Users className="w-5 h-5 text-[#9CA98C]" />
                        <span className="font-medium">{carrera.estudiantes} estudiantes</span>
                      </div>
                    </div>

                    {/* Requisitos */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-[#434343] mb-3 uppercase tracking-wider">Requisitos</h4>
                      <div className="space-y-2">
                        {carrera.requisitos.slice(0, 2).map((req: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-[#434343]/70 font-sans">
                            <CheckCircle2 className="w-4 h-4 text-[#9CA98C] flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón */}
                    <motion.button 
                      onClick={() => navigateToCarrera(carrera.id)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#434343] text-white py-4 font-semibold hover:bg-[#9CA98C] transition-all duration-300 font-sans flex items-center justify-center gap-3 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Más Información
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredCarreras.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-[#9CA98C]/20 rounded-2xl mt-8"
            >
              <p className="text-xl text-[#434343]/70 font-sans">
                No se encontraron programas con los filtros seleccionados
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal de detalles */}
      <AnimatePresence>
        {selectedCarrera && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeCarreraDetail}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-4 left-4 right-4 bottom-4 md:top-8 md:left-8 md:right-8 md:bottom-8 bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-[#9CA98C]/20 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${selectedCarrera.color} flex items-center justify-center rounded-xl shadow-lg`}>
                      {(() => {
                        const IconoComponente = iconosMap[selectedCarrera.icono] || iconosMap['Book'];
                        return <IconoComponente className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#434343] font-serif">{selectedCarrera.nombre}</h2>
                      <p className="text-[#434343]/60 font-sans">{selectedCarrera.area}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeCarreraDetail}
                    className="w-10 h-10 bg-[#434343] hover:bg-[#9CA98C] text-white flex items-center justify-center transition-colors duration-300 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <p className="text-[#434343]/70 text-lg leading-relaxed mb-6">
                    {selectedCarrera.descripcionCompleta}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#F4F1EA] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#9CA98C]" />
                        <span className="font-semibold text-[#434343]">Duración</span>
                      </div>
                      <p className="text-[#434343]/70">{selectedCarrera.duracion}</p>
                    </div>
                    <div className="bg-[#F4F1EA] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-[#9CA98C]" />
                        <span className="font-semibold text-[#434343]">Estudiantes</span>
                      </div>
                      <p className="text-[#434343]/70">{selectedCarrera.estudiantes}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#434343] mb-3 font-serif flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#9CA98C]" />
                      Materias Principales
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCarrera.materias.map((materia: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-[#434343]/70 font-sans">
                          <div className="w-2 h-2 bg-[#9CA98C] rounded-full" />
                          {materia}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#434343] mb-3 font-serif flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#9CA98C]" />
                      Beneficios
                    </h3>
                    <div className="space-y-2">
                      {selectedCarrera.beneficios.map((beneficio: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-[#434343]/70 font-sans">
                          <Zap className="w-4 h-4 text-[#9CA98C]" />
                          {beneficio}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-[#9CA98C]/20 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeCarreraDetail}
                      className="px-6 py-3 border-2 border-[#9CA98C] text-[#9CA98C] font-semibold hover:bg-[#9CA98C] hover:text-white transition-all duration-300 font-sans rounded-xl"
                    >
                      Cerrar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateToCarrera(selectedCarrera.id)}
                      className="px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-semibold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans rounded-xl shadow-lg"
                    >
                      Ver Página Completa
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}