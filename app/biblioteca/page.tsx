'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BibliotecaPage() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [iframeCargado, setIframeCargado] = useState(false);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setCargando(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIframeCargado(true);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Pantalla de carga */}
      <AnimatePresence>
        {cargando && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
              />
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold font-serif mb-4"
              >
                Biblioteca Virtual
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl opacity-90"
              >
                Cargando recursos educativos...
              </motion.p>

              {/* Puntos animados */}
              <motion.div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal - Biblioteca en fullscreen */}
      <AnimatePresence>
        {!cargando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full bg-white"
          >
            {/* Iframe de Open Library en pantalla completa */}
            <motion.iframe
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src="https://openlibrary.org"
              className="w-full h-full border-0"
              title="Biblioteca Virtual - Open Library"
              onLoad={handleIframeLoad}
            />
            
            {/* Overlay de carga del iframe */}
            <AnimatePresence>
              {!iframeCargado && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white flex items-center justify-center"
                >
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#9CA98C] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Cargando biblioteca...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón flotante para volver */}
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={() => router.push('/')}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E] text-white font-bold transition-all duration-300 shadow-2xl rounded-full group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Volver al Sitio</span>
              
              {/* Efecto de brillo */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100"
                initial={{ x: -20 }}
                whileHover={{ x: 20 }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>

            {/* Indicador de que es contenido externo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="fixed bottom-6 left-6 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
            >
               Biblioteca Virtual - Open Library
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}