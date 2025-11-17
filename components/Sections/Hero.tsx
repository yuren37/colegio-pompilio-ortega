'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const services = [
  "Desarrollo Web",
  "Diseño Profesional", 
  "Soluciones Digitales",
  "Tecnología Moderna"
];

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentService = services[currentServiceIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setDisplayText(currentService.substring(0, displayText.length - 1));
        setTypingSpeed(100);
      } else {
        setDisplayText(currentService.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === currentService) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setCurrentServiceIndex((prev) => (prev + 1) % services.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentServiceIndex, typingSpeed]);

  useEffect(() => {
    // Asegurar que el video se reproduzca
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Auto-play prevented:', error);
      });
    }
  }, []);

  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-[#0F1419] relative overflow-hidden flex items-center justify-center">
      
      {/* Video de fondo */}
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

      {/* Elementos de fondo minimalistas */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-1">
        <div className="absolute top-1/4 left-1/4 w-48 h-px bg-[#63B3ED]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-px h-48 bg-[#F6AD55]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        
        {/* Logo grande pero bien centrado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="relative w-full h-100 mx-auto">
            <Image
              src="/wa-hero.png"
              alt="Web Adventures"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="w-40 h-1 bg-[#63B3ED] mx-auto mt-8"></div>
        </motion.div>

        {/* Texto MÁS PEQUEÑO y bien alineado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-xl md:text-2xl font-light text-white">
            Especialistas en{' '}
            <span className="text-[#63B3ED] font-medium">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        </motion.div>

        {/* Botón bien posicionado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <button 
            onClick={scrollToServices}
            className="btn-sleek px-12 py-4 text-lg font-medium hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-sm border border-white/20"
          >
            Servicios
          </button>
        </motion.div>

        {/* Indicador de scroll bien separado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={scrollToServices}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
          <span className="text-sm text-white/80 font-medium uppercase tracking-wider hover:text-white transition-colors">
            Explorar
          </span>
        </motion.div>

      </div>

      {/* Línea divisoria inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent z-10"></div>

    </section>
  );
}