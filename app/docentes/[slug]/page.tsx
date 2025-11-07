// app/docentes/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Star, Crown, Users, BookOpen, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mapeo de slugs a URLs de Blogger
const docentesMap: { [key: string]: { url: string; especial?: boolean; nombre: string } } = {
  'nury-castillo': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/nury-castillo.html',
    nombre: 'Nury Castillo'
  },
  'fausto-castillo': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/fausto-castillo.html',
    nombre: 'Fausto Castillo',
    especial: true
  },
  'wilson-madrid': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/wilson-madrid.html',
    nombre: 'Wilson Madrid',
    especial: true
  },
  'jessica-pineda': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/jessica-pineda.html',
    nombre: 'Jessica Pineda'
  },
  'francisco-altamirano': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/francisco-altamirano.html',
    nombre: 'Francisco Altamirano',
    especial: true
  },
  'luis-rodriguez': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/luis-rodriguez.html',
    nombre: 'Luis Rodríguez'
  },
  'saul-palma': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/saul-palma.html',
    nombre: 'Saul Palma',
    especial: true
  },
  'martha-nunez': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/martha-nunez.html',
    nombre: 'Martha Nuñez'
  },
  'mercedes-amaya': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/mercedes-amaya.html',
    nombre: 'Mercedes Amaya',
    especial: true
  },
  'danilo-amaya': {
    url: 'https://institutopompilioortega.blogspot.com/2025/11/danilo-amaya.html',
    nombre: 'Danilo Amaya',
    especial: true
  }
};

export default function DocentePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [cargando, setCargando] = useState(true);
  const [iframeCargado, setIframeCargado] = useState(false);
  const [docenteInfo, setDocenteInfo] = useState<{ url: string; especial?: boolean; nombre: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 2000);

    // Buscar información del docente
    const info = docentesMap[slug];
    if (info) {
      setDocenteInfo(info);
    }

    return () => clearTimeout(timer);
  }, [slug]);

  const handleIframeLoad = () => {
    setIframeCargado(true);
  };

  if (!docenteInfo) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Docente no encontrado</h2>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const { url, especial, nombre } = docenteInfo;
  const esDanilo = slug === 'danilo-amaya';

  return (
    <div className="fixed inset-0 z-50">
      {/* Pantalla de carga */}
      <AnimatePresence>
        {cargando && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 flex items-center justify-center z-50 ${
              esDanilo 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                : especial 
                ? 'bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E]' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}
          >
            <motion.div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
              />
              
              <motion.h1 className="text-4xl font-bold font-serif mb-4 flex items-center justify-center gap-3">
                {esDanilo && <Crown className="w-8 h-8" />}
                {especial && !esDanilo && <Star className="w-8 h-8" />}
                {nombre}
                {esDanilo && <Crown className="w-8 h-8" />}
                {especial && !esDanilo && <Star className="w-8 h-8" />}
              </motion.h1>
              
              <motion.p className="text-xl opacity-90">
                Cargando perfil{especial ? ' especial' : ''}...
              </motion.p>

              <motion.div className="mt-6">
                {esDanilo ? (
                  <Crown className="w-16 h-16 mx-auto" />
                ) : especial ? (
                  <Star className="w-16 h-16 mx-auto" />
                ) : (
                  <Users className="w-16 h-16 mx-auto" />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <AnimatePresence>
        {!cargando && (
          <motion.div className="w-full h-full bg-white">
            {/* Iframe del docente */}
            <motion.iframe
              src={url}
              className="w-full h-full border-0"
              title={`${nombre} - Instituto Pompilio Ortega`}
              onLoad={handleIframeLoad}
            />
            
            {/* Overlay de carga del iframe */}
            <AnimatePresence>
              {!iframeCargado && (
                <motion.div className="absolute inset-0 bg-white flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
                      esDanilo ? 'text-amber-500' : especial ? 'text-[#9CA98C]' : 'text-blue-500'
                    }`} />
                    <p className="text-gray-600 text-lg">Cargando perfil de {nombre}...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón flotante para volver */}
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={() => router.push('/#docentes')}
              className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 text-white font-bold transition-all duration-300 shadow-2xl rounded-full group ${
                esDanilo 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' 
                  : especial 
                  ? 'bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E]' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Volver a Docentes</span>
            </motion.button>

            {/* Indicador de docente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className={`fixed bottom-6 left-6 z-50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm font-bold ${
                esDanilo 
                  ? 'bg-amber-500' 
                  : especial 
                  ? 'bg-[#9CA98C]' 
                  : 'bg-blue-500'
              }`}
            >
              {esDanilo ? '👑 ' : especial ? '⭐ ' : '👨‍🏫 '}
              {nombre} - Blogger
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}