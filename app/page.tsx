// app/page.tsx - VERSIÓN COMPLETA CON CARRERAS Y DOCENTES
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Sections/Hero';
import CarrerasSection from '../components/Sections/CarrerasSection';

import Matricula from '../components/Sections/Matricula';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Secciones principales */}
      <main>
        <Hero />
        <CarrerasSection />
     
        <Matricula />
      </main>
      
      {/* Footer simplificado */}
      <footer className="bg-gradient-to-br from-[#434343] to-[#666666] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          
          {/* Logo y nombre */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IPO</span>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold font-serif">Instituto Pompilio Ortega</h3>
              <p className="text-gray-300 font-sans">Excelencia Educativa</p>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="#inicio" className="text-gray-300 hover:text-white transition-colors font-sans">
              Inicio
            </Link>
            <Link href="#carreras" className="text-gray-300 hover:text-white transition-colors font-sans">
              Carreras
            </Link>
            <Link href="#docentes" className="text-gray-300 hover:text-white transition-colors font-sans">
              Docentes
            </Link>
            <Link href="#matricula" className="text-gray-300 hover:text-white transition-colors font-sans">
              Matrícula
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors font-sans">
              Blog
            </Link>
            <Link href="/biblioteca" className="text-gray-300 hover:text-white transition-colors font-sans">
              Biblioteca
            </Link>
          </div>
          
          {/* Botón desarrollador */}
          <div className="mb-8">
            <Link 
              href="/desarrollo"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 font-sans group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Conoce al Desarrollador
            </Link>
          </div>
          
          {/* Línea separadora */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-gray-300 font-sans">
              &copy; 2025 Instituto Pompilio Ortega - Formando líderes del mañana
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}