import Navbar from '@/components/Layout/Navbar';
import Hero from '@/components/Sections/Hero';
import Carreras from '@/components/Sections/Carreras';
import Docentes from '@/components/Sections/Docents';
import Matricula from '@/components/Sections/Matricula';
import BlogSection from '@/components/blog/BlogSection';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Carreras />
      <Docentes />
      <Matricula />
      <BlogSection />
      
      {/* Footer con botón de desarrollo */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Instituto Pompilio Ortega</h3>
            <p className="text-gray-300 mb-4">Excelencia Educativa desde hace más de seis décadas</p>
            
            {/* Botón para página de desarrollo */}
            <div className="mb-6">
              <Link 
                href="/desarrollo"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Conoce al Desarrollador
              </Link>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <p className="text-sm text-gray-400">
                &copy; 2025 <strong>Einar Yuren Marquez Gómez</strong> - Desarrollo y diseño web protegidos.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Contenido institucional propiedad del Instituto Pompilio Ortega | 
                Proyecto Académico BTP Informática
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}