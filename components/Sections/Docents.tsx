// components/DocentesSection.tsx (o donde tengas este archivo)
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BookOpen, Award, Users, GraduationCap, Trophy, Star, ChevronRight, ChevronLeft, Heart, Crown, Medal, BookMarked, Sparkles, Briefcase } from 'lucide-react';
import { docentesStorage } from '@/lib/docentesStorage';
import { Docente, Fundador } from '@/types/docente';

// Mapeo de íconos
const iconosMap: { [key: string]: React.ComponentType<any> } = {
  'Users': Users,
  'BookOpen': BookOpen,
  'GraduationCap': GraduationCap,
  'Award': Award,
  'Trophy': Trophy,
  'Briefcase': Briefcase,
};

export default function DocentesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [particles, setParticles] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [fundador, setFundador] = useState<Fundador | null>(null);
  const [cargando, setCargando] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar datos de docentes
    const cargarDatos = () => {
      try {
        const docentesData = docentesStorage.getDocentes();
        const fundadorData = docentesStorage.getFundador();
        
        setDocentes(docentesData);
        setFundador(fundadorData);
      } catch (error) {
        console.error('Error cargando datos de docentes:', error);
        setDocentes([]);
        setFundador(null);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();

    // Partículas de fondo elegantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Carrusel automático
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && docentes.length > 0) {
      interval = setInterval(() => {
        nextDocente();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, currentIndex, docentes.length]);

  const nextDocente = () => {
    if (docentes.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % docentes.length);
  };

  const prevDocente = () => {
    if (docentes.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + docentes.length) % docentes.length);
  };

  const goToDocente = (index: number) => {
    if (docentes.length === 0) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleMasInformacion = (docenteId: number) => {
    window.location.href = `/docentes/${docenteId}`;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Si no hay datos, no mostrar la sección
  if (cargando) {
    return (
      <section id="docentes" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#434343] font-sans">Cargando equipo docente...</p>
        </div>
      </section>
    );
  }

  if (docentes.length === 0 && !fundador) {
    return null; // No mostrar la sección si no hay datos
  }

  const currentDocente = docentes[currentIndex];
  const IconComponent = currentDocente ? iconosMap[currentDocente.icono] || Users : Users;

  return (
    <section id="docentes" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] relative overflow-hidden min-h-screen">
      
      {/* Partículas de fondo sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#9CA98C]/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [0, 0.3, 0],
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

      {/* Efectos de cristal en el fondo */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#9CA98C]/10 to-[#7D8A6E]/5 blur-3xl rounded-full"
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
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#434343]/10 to-[#666666]/5 blur-3xl rounded-full"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.15, 0.08],
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
            <GraduationCap className="w-5 h-5 text-[#9CA98C]" />
            <span className="text-sm font-semibold text-[#434343] uppercase tracking-wider">
              Cuerpo Docente
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#434343] mb-6 font-serif"
          >
            Nuestro <span className="bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] bg-clip-text text-transparent">Equipo</span>
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-[#434343]/70 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Profesionales comprometidos con la excelencia educativa y el desarrollo integral de nuestros estudiantes
          </motion.p>
        </motion.div>

        {/* SECCIÓN DEL FUNDADOR - ARRIBA */}
        {fundador && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#9CA98C]/10 rounded-full mb-4"
                >
                  <Crown className="w-5 h-5 text-[#9CA98C]" />
                  <span className="text-sm font-semibold text-[#434343] uppercase tracking-wider">
                    Liderazgo Educativo
                  </span>
                </motion.div>
                <h3 className="text-3xl font-bold text-[#434343] font-serif">
                  Nuestro Fundador
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                      {/* FOTO MÁS GRANDE DEL FUNDADOR */}
                      <div className="w-80 h-80 bg-gradient-to-br from-[#434343] to-[#666666] rounded-xl flex items-center justify-center text-white font-bold text-lg relative overflow-hidden">
                        {fundador.foto && fundador.foto !== '/api/placeholder/400/400' ? (
                          <img 
                            src={fundador.foto} 
                            alt={fundador.nombre}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Users className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Efecto de brillo sutil - MANTENIENDO EL EFECTO QUE TE GUSTA */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: [-100, 300],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                          style={{
                            transform: 'skewX(-30deg)',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="md:col-span-2 text-center md:text-left">
                  <motion.h4
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-[#434343] mb-2 font-serif"
                  >
                    {fundador.nombre}
                  </motion.h4>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-[#9CA98C] font-semibold mb-4 font-sans"
                  >
                    {fundador.titulo}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#434343]/70 mb-6 font-sans leading-relaxed"
                  >
                    {fundador.descripcion}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {fundador.reconocimientos.map((reconocimiento, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-white/50 rounded-lg"
                      >
                        <Award className="w-4 h-4 text-[#9CA98C] flex-shrink-0" />
                        <span className="text-sm text-[#434343] font-sans">
                          {reconocimiento}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CARRUSEL PRINCIPAL DE DOCENTES - CON FOTOS MÁS GRANDES */}
        {docentes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              
              {/* Controles de navegación */}
              <div className="flex justify-between items-center mb-8">
                <motion.button
                  onClick={prevDocente}
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-[#9CA98C]/20 hover:bg-[#9CA98C]/10 transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6 text-[#434343]" />
                </motion.button>

                <div className="text-center">
                  <motion.h3 
                    key={`title-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-[#434343] font-serif"
                  >
                    Nuestros Docentes
                  </motion.h3>
                  <motion.p 
                    key={`subtitle-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#9CA98C] font-semibold"
                  >
                    {currentIndex + 1} de {docentes.length}
                  </motion.p>
                </div>

                <motion.button
                  onClick={nextDocente}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-[#9CA98C]/20 hover:bg-[#9CA98C]/10 transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6 text-[#434343]" />
                </motion.button>
              </div>

              {/* Carrusel con efecto de puerta giratoria */}
              <div className="relative h-auto md:h-96" ref={carouselRef}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                      rotateY: { duration: 0.5 },
                      scale: { duration: 0.4 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);

                      if (swipe < -swipeConfidenceThreshold) {
                        nextDocente();
                      } else if (swipe > swipeConfidenceThreshold) {
                        prevDocente();
                      }
                    }}
                    className="absolute inset-0"
                  >
                    <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                      {/* FOTO DEL DOCENTE - MÁS GRANDE */}
                      <div className="flex justify-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="relative"
                        >
                          {/* Marco de la foto con efecto cristal - MÁS GRANDE */}
                          <div className="relative p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
                            {/* FOTO MÁS GRANDE - 280x280 */}
                            <div className="w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl overflow-hidden shadow-inner relative">
                              {currentDocente.foto && currentDocente.foto !== '/api/placeholder/300/300' ? (
                                <img 
                                  src={currentDocente.foto} 
                                  alt={currentDocente.nombre}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                                  <IconComponent className="w-16 h-16 text-gray-400" />
                                </div>
                              )}
                              
                              {/* EFECTO DE BRILLO QUE TE GUSTA - MANTENIDO */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{
                                  x: [-100, 300],
                                }}
                                transition={{
                                  duration: 6,
                                  repeat: Infinity,
                                  delay: Math.random() * 2
                                }}
                                style={{
                                  transform: 'skewX(-30deg)',
                                }}
                              />
                            </div>
                            
                            {/* Efecto de brillo exterior */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{
                                x: [-100, 300],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: Math.random() * 2
                              }}
                              style={{
                                transform: 'skewX(-30deg)',
                              }}
                            />
                          </div>

                          {/* Badge de experiencia */}
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -top-3 -right-3 bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm"
                          >
                            {currentDocente.experiencia}
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Información del docente */}
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center md:text-left"
                      >
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                          <motion.div
                            animate={{
                              rotate: [0, 10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <IconComponent className="w-6 h-6 text-[#9CA98C]" />
                          </motion.div>
                          <span className="text-sm font-bold text-[#9CA98C] uppercase tracking-wide">
                            {currentDocente.especialidad}
                          </span>
                        </div>

                        <motion.h3
                          key={`name-${currentIndex}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-2xl md:text-3xl font-bold text-[#434343] mb-2 font-serif"
                        >
                          {currentDocente.nombre}
                        </motion.h3>

                        <motion.p
                          key={`title-${currentIndex}`}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-lg text-[#9CA98C] font-semibold mb-4 font-sans"
                        >
                          {currentDocente.titulo}
                        </motion.p>

                        <motion.p
                          key={`formation-${currentIndex}`}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="text-[#434343]/70 mb-6 font-sans text-sm leading-relaxed"
                        >
                          {currentDocente.formacion}
                        </motion.p>

                        {/* Materias */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="space-y-2 mb-6"
                        >
                          <h4 className="font-semibold text-[#434343] mb-3 flex items-center gap-2 justify-center md:justify-start">
                            <BookMarked className="w-4 h-4 text-[#9CA98C]" />
                            Materias que imparte:
                          </h4>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {currentDocente.materias.slice(0, 3).map((materia, index) => (
                              <motion.span
                                key={materia}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm text-[#434343] border border-[#9CA98C]/20 shadow-sm"
                              >
                                {materia}
                              </motion.span>
                            ))}
                            {currentDocente.materias.length > 3 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="px-3 py-1 bg-[#9CA98C]/10 rounded-full text-sm text-[#434343] border border-[#9CA98C]/20"
                              >
                                +{currentDocente.materias.length - 3} más
                              </motion.span>
                            )}
                          </div>
                        </motion.div>

                        {/* BOTÓN MÁS INFORMACIÓN - CORREGIDO Y FUNCIONAL */}
                        <motion.button
                          onClick={() => handleMasInformacion(currentDocente.id)}
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: "rgba(156, 169, 140, 0.1)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full md:w-auto bg-white/80 backdrop-blur-sm border border-[#9CA98C]/30 text-[#434343] font-semibold py-3 px-8 rounded-xl hover:bg-[#9CA98C]/10 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                          <span>Más Información</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicadores de paginación */}
              <div className="flex justify-center gap-2 mt-8">
                {docentes.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToDocente(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-[#9CA98C] scale-125' 
                        : 'bg-[#9CA98C]/30 hover:bg-[#9CA98C]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
            <p className="text-lg text-[#434343]/70 mb-6 font-sans">
              ¿Interesado en unirte a nuestro equipo docente?
            </p>
            <motion.button
              onClick={() => window.location.href = '#contacto'}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-semibold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
            >
              <span>Contactar para Vacantes</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}