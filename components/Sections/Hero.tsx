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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] pt-20">
      
    {/* Video de fondo desde YouTube  */}
<div className="absolute inset-0 z-0">
  <iframe
    ref={iframeRef}
    src="https://www.youtube.com/embed/J4MIXHh6VfQ?autoplay=1&mute=1&loop=1&controls=0&playlist=J4MIXHh6VfQ&modestbranding=1&rel=0&playsinline=1&enablejsapi=1"
    className="absolute inset-0 w-full h-full scale-105"
    frameBorder="0"
    allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
    allowFullScreen
    title="Video background Colegio Pompilio Ortega"
  />
  
  {/* Overlay para mejorar legibilidad del texto */}
  <div className="absolute inset-0 bg-black/40"></div>
</div>

      {/* Motion Blur Cristal  */}
      <div className="absolute inset-0 z-1">
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

      {/* Fondo de ecuaciones  */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {mathEquations.map((equation, index) => (
          <motion.div
            key={index}
            className="absolute text-white/30 font-mono font-bold whitespace-nowrap"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, -80 - Math.random() * 50],
              opacity: [0, 0.06, 0],
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

      {/* Burbujas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL - ORDENADO Y JERARQUIZADO */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loader inicial */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center z-50"
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
                  <Atom className="w-8 h-8 text-[#9CA98C]" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#434343] font-sans text-sm"
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
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md border border-[#9CA98C]/20 shadow-lg mb-8"
          style={{ borderRadius: '8px' }}
        >
          <div className="flex gap-2">
            <Calculator className="w-4 h-4 text-[#9CA98C]" />
            <Atom className="w-4 h-4 text-[#434343]" />
            <Sigma className="w-4 h-4 text-[#8B4513]" />
          </div>
          <span className="text-sm font-semibold text-[#434343] font-sans">
            Enfoque en Matemáticas y Física
          </span>
        </motion.div>

        {/* TÍTULO PRINCIPAL */}
        <div className="mb-12">
          {/* Línea 1: Instituto No Gubernamental */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Times_New_Roman',serif] tracking-wide leading-tight drop-shadow-lg">
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
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent font-['Georgia',serif] leading-tight drop-shadow-2xl">
              Pompilio Ortega
            </h2>
          </motion.div>

          {/* Línea 3: Ofrecemos + palabra animada */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white font-sans drop-shadow-lg">
              Ofrecemos
            </div>
            <div className="relative h-16 flex items-center justify-center min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                  animate={{ 
                    y: 0, 
                    opacity: 1, 
                    filter: "blur(0px)" 
                  }}
                  exit={{ 
                    y: -30, 
                    opacity: 0, 
                    filter: "blur(8px)" 
                  }}
                  transition={{ 
                    duration: 0.7, 
                    ease: "easeInOut" 
                  }}
                  className="absolute text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] bg-clip-text text-transparent font-bold font-['Georgia',serif] whitespace-nowrap drop-shadow-lg"
                >
                  {rotatingWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Descripción  */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-sans text-center px-4 drop-shadow-lg"
        >
          Por más de seis décadas, formamos mentes analíticas y líderes del mañana 
          mediante una educación basada en matemáticas, pero sobre todo valores y disciplina.
        </motion.p>

        {/* Botones de acción  */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToNext}
            className="group px-8 py-4 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 font-sans backdrop-blur-sm"
            style={{ borderRadius: '8px' }}
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Descubre Nuestras Carreras
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-white/90 backdrop-blur-md text-[#434343] font-bold border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-sans"
            style={{ borderRadius: '8px' }}
          >
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Proceso de Matrícula
          </motion.button>
        </motion.div>

        {/* Indicador de scroll - ABAJO SEPARADO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToNext}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
          <span className="text-sm text-white/80 font-medium font-sans drop-shadow">
            Explorar más
          </span>
        </motion.div>
      </div>

      {/* Línea decorativa inferior - SEPARADOR CLARO */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ duration: 1.5, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent z-10"
      />
    </section>
  );
}