'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, BookOpen, Calculator, Atom, Sigma } from 'lucide-react';

const rotatingWords = [
  "Excelencia Académica",
  "Valores Humanos", 
  "Tecnología Avanzada",
  "Formación Integral",
  "Liderazgo Juvenil"
];

const mathEquations = [
  "E = mc²",
  "a² + b² = c²",
  "e^(iπ) + 1 = 0",
  "F = ma",
  "∇·E = ρ/ε₀",
  "ψ = A sin(kx)",
  "∫ f(x) dx",
  "lim x→∞",
  "PV = nRT",
  "x = [-b ± √(b²-4ac)]/2a"
];

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Asegurar que el video se reproduzca - COMO EL QUE FUNCIONA
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Auto-play prevented:', error);
      });
    }

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    const wordInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(wordInterval);
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('carreras');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-[#0F1419] relative overflow-hidden flex items-center justify-center">
      
      {/* Video de fondo - EXACTAMENTE COMO EL QUE FUNCIONA */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/fondo-hero.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Elementos de fondo minimalistas - MÁS SIMPLES COMO EL QUE FUNCIONA */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-1">
        <div className="absolute top-1/4 left-1/4 w-48 h-px bg-[#dadada]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-px h-48 bg-[#F6AD55]"></div>
      </div>

      {/* Fondo de ecuaciones - MANTENIDO PERO CON MEJOR Z-INDEX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {mathEquations.map((equation, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20 font-mono font-bold whitespace-nowrap"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, -80 - Math.random() * 50],
              opacity: [0, 0.04, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              fontSize: `${12 + Math.random() * 8}px`,
              filter: 'blur(0.5px)'
            }}
          >
            {equation}
          </motion.div>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL - ESTRUCTURA SIMILAR AL QUE FUNCIONA */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        
        {/* Loader inicial */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F1419] flex items-center justify-center z-50"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Atom className="w-8 h-8 text-[#c5c7be]" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white font-sans text-sm"
                >
                  Cargando excelencia educativa...
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge de enfoque científico */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg mb-8 rounded-lg"
        >
          <div className="flex gap-2">
            <Calculator className="w-4 h-4" />
            <Atom className="w-4 h-4" />
            <Sigma className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold font-sans">
            Enfoque en Matemáticas y Física
          </span>
        </motion.div>

        {/* TÍTULO PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          {/* Línea 1: Instituto No Gubernamental */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Times_New_Roman',serif] tracking-wide leading-tight">
              Instituto No Gubernamental
            </h1>
          </motion.div>
          
          {/* Línea 2: Pompilio Ortega */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-['Georgia',serif] leading-tight">
              Pompilio Ortega
            </h2>
          </motion.div>

          {/* Línea divisoria como el que funciona */}
          <div className="w-40 h-1 bg-[#a7a9ab] mx-auto mt-8"></div>

          {/* Línea 3: Ofrecemos + palabra animada */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12"
          >
            <div className="text-xl md:text-2xl font-light text-white mb-4">
              Ofrecemos{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-[#cdcfc3] font-medium"
                >
                  {rotatingWords[currentWordIndex]}
                  <span className="animate-pulse">|</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Descripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Por más de seis décadas, formamos mentes analíticas y líderes del mañana 
            mediante una educación basada en matemáticas, pero sobre todo valores y disciplina.
          </p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToNext}
              className="px-8 py-4 text-lg font-medium hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Descubre Nuestras Carreras
            </button>
            
            <button 
              className="px-8 py-4 text-lg font-medium hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg flex items-center gap-3"
            >
              <BookOpen className="w-5 h-5" />
              Proceso de Matrícula
            </button>
          </div>
        </motion.div>

        {/* Indicador de scroll - COMO EL QUE FUNCIONA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={scrollToNext}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
          <span className="text-sm text-white/80 font-medium uppercase tracking-wider hover:text-white transition-colors">
            Explorar más
          </span>
        </motion.div>

      </div>

      {/* Línea divisoria inferior - COMO EL QUE FUNCIONA */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"></div>

    </section>
  );
}