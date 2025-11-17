export default function DesarrolloPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Arquitectura del Sistema
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma web integral desarrollada con stack tecnológico moderno y soluciones innovadoras
          </p>
        </div>

        {/* Sección de la Empresa Desarrolladora */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Empresa Desarrolladora</h2>
              
              <div className="space-y-4 text-lg">
                <div>
                  <strong className="text-gray-800 block mb-1">Empresa:</strong>
                  <p className="text-gray-700">Web Adventures HN</p>
                </div>
                <div>
                  <strong className="text-gray-800 block mb-1">Especialización:</strong>
                  <p className="text-gray-700">Desarrollo Web Full-Stack y Soluciones Digitales</p>
                </div>
                <div>
                  <strong className="text-gray-800 block mb-1">Líder Técnico:</strong>
                  <p className="text-gray-700">Einar Yuren Marquez Gómez</p>
                </div>
                <div>
                  <strong className="text-gray-800 block mb-1">Contacto Profesional:</strong>
                  <p className="text-gray-700">einermarquez376@gmail.com</p>
                </div>
                <div>
                  <strong className="text-gray-800 block mb-1">WhatsApp Empresarial:</strong>
                  <p className="text-gray-700">+504 9219-5392</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Stack Tecnológico Implementado</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Next.js 14 con TypeScript</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Google Sheets API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Sistema de Panel Administrativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Servicios de Upload de Archivos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span>Formularios Inteligentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <span>Editor de Texto Enriquecido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span>Integración WhatsApp API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span>Base de Datos en Tiempo Real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Características Principales */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Backend & Database */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Infraestructura Backend</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Integración Google Sheets como Base de Datos</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Sistema de base de datos en tiempo real para gestión de matrículas y datos estudiantiles
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>API Routes Personalizadas</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Endpoints customizados para operaciones CRUD y gestión de datos institucionales
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Sistema de Gestión de Archivos</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Servicios de upload y administración de documentos institucionales
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Frontend & UX */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frontend y Experiencia de Usuario</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Formularios Inteligentes con Validación</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Sistema de formularios con validación en tiempo real y experiencia de usuario optimizada
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Editor de Texto Enriquecido</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Interfaz WYSIWYG para creación y edición de contenido institucional
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <div>
                  <strong>Biblioteca Digital Integrada</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Sistema de gestión y distribución de recursos educativos digitales
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Solución de Pre-Matrícula */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sistema de Pre-Matrícula con WhatsApp</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Problema Solucionado</h3>
              <p className="text-gray-700 mb-4">
                Identificación de pérdida estudiantil debido a barreras geográficas y procesos de matrícula arcaicos que requerían desplazamiento físico al instituto.
              </p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm">
                  <strong>Situación inicial:</strong> Estudiantes potenciales no completaban la pre-matrícula debido a la necesidad de viajar hasta el colegio para el proceso.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Solución Implementada</h3>
              <p className="text-gray-700 mb-4">
                Desarrollo de un sistema de pre-matrícula automatizado mediante integración con WhatsApp institucional, eliminando completamente la barrera geográfica.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  <strong>Resultado:</strong> Infraestructura lista para producción que permite pre-matrícula 100% digital, reduciendo significativamente la pérdida de estudiantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Administrativo */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Panel Administrativo Avanzado</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Gestión Académica Integral</h4>
              <p className="text-sm text-blue-700">
                Administración completa de estudiantes, matrículas y datos académicos con interfaz intuitiva
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Sistema de Contenido Dinámico</h4>
              <p className="text-sm text-green-700">
                Editor de texto enriquecido para actualización y gestión de contenido institucional en tiempo real
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3">Integración de Base de Datos</h4>
              <p className="text-sm text-purple-700">
                Conexión con Google Sheets para accesibilidad y gestión colaborativa de la información
              </p>
            </div>
          </div>
        </div>

        {/* Llamada a la Acción */}
        <div className="text-center bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-12 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">¿Interesado en Nuestros Servicios?</h2>
          <p className="text-xl mb-8 opacity-90">
            Capacidad demostrada para desarrollar soluciones complejas y escalables que resuelven problemas reales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/50492195392?text=Hola%20Web%20Adventures%20HN,%20me%20interesa%20sus%20servicios%20de%20desarrollo"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span>
              Contactar por WhatsApp
            </a>
            <a 
              href="mailto:einermarquez376@gmail.com?subject=Servicios de Desarrollo Web&body=Hola Web Adventures HN, me interesa conocer más sobre sus servicios..."
              className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Contactar por Email
            </a>
            <a 
              href="/"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Volver al Sitio Principal
            </a>
          </div>
        </div>

        {/* Footer de la página */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-700">
            &copy; 2025 <strong>Web Adventures HN</strong> - 
            Todos los derechos de desarrollo reservados
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Proyecto desarrollado por Web Adventures HN para Instituto Pompilio Ortega
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Líder Técnico: Einar Yuren Marquez Gómez
          </p>
        </div>

      </div>
    </div>
  );
}