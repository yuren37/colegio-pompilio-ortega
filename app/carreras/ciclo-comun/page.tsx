// app/carreras/ciclo-comun/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CicloComunPage() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [iframeCargado, setIframeCargado] = useState(false);

  useEffect(() => {
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
      <AnimatePresence>
        {cargando && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] flex items-center justify-center z-50"
          >
            <motion.div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
              />
              
              <motion.h1 className="text-4xl font-bold font-serif mb-4">
                Ciclo Común (7mo - 9no Grado)
              </motion.h1>
              
              <motion.p className="text-xl opacity-90">
                Cargando programa educativo...
              </motion.p>

              <motion.div className="mt-6">
                <BookOpen className="w-16 h-16 mx-auto" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!cargando && (
          <motion.div className="w-full h-full bg-white">
            <motion.iframe
              src="https://institutopompilioortega.blogspot.com/2025/11/ciclo-comun-7mo-9no-grado.html"
              className="w-full h-full border-0"
              title="Ciclo Común 7mo - 9no Grado"
              onLoad={handleIframeLoad}
            />
            
            <AnimatePresence>
              {!iframeCargado && (
                <motion.div className="absolute inset-0 bg-white flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#9CA98C] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Cargando programa...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => router.push('/')}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E] text-white font-bold transition-all duration-300 shadow-2xl rounded-full group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Volver al Inicio</span>
            </motion.button>

            <motion.div className="fixed bottom-6 left-6 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
               Ciclo Común 
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}