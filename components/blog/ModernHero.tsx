// components/ModernHero.tsx - VERSIÓN COMPLETAMENTE CORREGIDA
'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function ModernHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-50px',
    amount: 0.1
  });

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          ref={ref}
          className="space-y-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Logo animado */}
          <motion.div
            className="inline-block"
            animate={isInView ? { 
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              duration: 6,
              ease: [0.22, 0.9, 0.3, 1],
              repeat: Infinity,
            }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl">
              IPO
            </div>
          </motion.div>

          {/* Título con stagger */}
          <div className="space-y-4">
            {['Instituto', 'Pompilio', 'Ortega'].map((word, index) => (
              <motion.h1
                key={word}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-neutral-900 font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 0.9, 0.3, 1],
                }}
              >
                {word}
              </motion.h1>
            ))}
          </div>

          {/* Descripción */}
          <motion.p
            className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.6,
              ease: [0.22, 0.9, 0.3, 1],
            }}
          >
            Formando líderes del mañana con educación de calidad, valores y innovación
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.8,
              ease: [0.22, 0.9, 0.3, 1],
            }}
          >
            <button className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Solicitar Información
            </button>
            <button className="border border-neutral-300 text-neutral-700 px-8 py-4 rounded-full font-semibold hover:border-green-500 hover:text-green-500 transition-all duration-300 hover:-translate-y-1">
              Ver Programas
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}