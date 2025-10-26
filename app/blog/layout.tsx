// app/blog/layout.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
      {/* Header del Blog con animaciones */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-[#434343] to-[#666666] text-white pt-32 pb-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb/Navegación */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            {/* Botón Volver al Inicio */}
            <Link
              href="/"
              className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-bold text-sm">Volver al Inicio</span>
            </Link>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <Link 
                href="/" 
                className="hover:text-[#9CA98C] transition-colors duration-300 flex items-center space-x-1"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-[#9CA98C] font-bold">Blog</span>
            </div>
          </motion.nav>

          {/* Título y Descripción del Blog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            >
              Blog Educativo
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Descubre artículos, noticias y recursos educativos del Instituto Pompilio Ortega
            </motion.p>
          </motion.div>

          {/* Elementos decorativos */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9CA98C] to-transparent opacity-60" />
        </div>
      </motion.header>

      {/* Contenido Principal del Blog */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {children}
      </motion.main>

      {/* Footer del Blog */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white border-t-2 border-[#9CA98C]/20 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#434343] to-[#666666] flex items-center justify-center"
              style={{ 
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
              }}
            >
              <span className="text-white font-bold text-lg font-serif">PO</span>
            </div>
            <p className="font-bold text-[#434343] font-serif text-lg">
              Instituto Pompilio Ortega
            </p>
          </div>
          <p className="text-[#434343]/60 text-sm mb-6">
            Excelencia Educativa desde 1960 • Formando líderes del mañana
          </p>
          
          {/* Botón Volver Arriba */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E] text-white px-6 py-3 font-bold transition-all duration-300 shadow-lg"
            style={{ 
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
            }}
          >
            Volver Arriba
          </motion.button>
        </div>
      </motion.footer>
    </div>
  );
}