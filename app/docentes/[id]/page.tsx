// app/docentes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Users, 
  GraduationCap, 
  Trophy, 
  Star, 
  Briefcase, 
  Clock, 
  Phone, 
  ChevronRight,
  Mail
} from 'lucide-react';
import { docentesStorage } from '@/lib/docentesStorage';
import { Docente } from '@/types/docente';

// Mapeo de íconos
const iconosMap: { [key: string]: React.ComponentType<any> } = {
  Users: Users,
  BookOpen: BookOpen,
  GraduationCap: GraduationCap,
  Award: Award,
  Trophy: Trophy,
  Briefcase: Briefcase,
};

export default function DocenteDetail() {
  const params = useParams();
  const docenteId = params.id as string;
  
  const [docente, setDocente] = useState<Docente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDocente = () => {
      try {
        if (!docenteId) {
          setError('ID de docente no válido');
          setCargando(false);
          return;
        }

        const id = parseInt(docenteId);
        if (isNaN(id)) {
          setError('ID de docente no válido');
          setCargando(false);
          return;
        }

        const docenteData = docentesStorage.getDocenteById(id);
        if (!docenteData) {
          setError('Docente no encontrado');
          setCargando(false);
          return;
        }

        setDocente(docenteData);
        setError(null);
      } catch (err) {
        console.error('Error cargando docente:', err);
        setError('Error al cargar la información del docente');
      } finally {
        setCargando(false);
      }
    };

    cargarDocente();
  }, [docenteId]);

  const goBack = () => {
    window.history.back();
  };

  const handleContacto = () => {
    if (!docente) return;
    
    const message = `Hola, me interesa contactar al ${docente.titulo} ${docente.nombre}. ¿Podrían ayudarme con información de contacto?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/504TU_NUMERO?text=${encodedMessage}`, '_blank');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#434343] font-sans">Cargando información del docente...</p>
        </div>
      </div>
    );
  }

  if (error || !docente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#434343] mb-2 font-serif">Docente no encontrado</h2>
          <p className="text-[#434343]/70 mb-6 font-sans">
            {error || 'El docente que buscas no está disponible en este momento.'}
          </p>
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-6 py-3 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors mx-auto font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Docentes
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = iconosMap[docente.icono] || Users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border-b-2 border-[#9CA98C]/20 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.button
              onClick={goBack}
              whileHover={{ x: -4 }}
              className="flex items-center gap-3 text-[#434343] hover:text-[#9CA98C] font-bold transition-colors duration-300 font-sans"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              Volver a Docentes
            </motion.button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] flex items-center justify-center shadow-lg"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}>
                <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-[#434343] font-serif">{docente.nombre}</h1>
                <p className="text-[#434343]/60 font-sans">{docente.titulo}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Foto/Icono del Docente */}
            <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl text-center"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <div className="w-32 h-32 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] mx-auto mb-4 flex items-center justify-center shadow-lg"
                style={{ 
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
                }}>
                {docente.foto && docente.foto !== '/api/placeholder/300/300' ? (
                  <img 
                    src={docente.foto} 
                    alt={docente.nombre}
                    className="w-full h-full object-cover"
                    style={{ 
                      clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
                    }}
                  />
                ) : (
                  <IconComponent className="w-16 h-16 text-white" strokeWidth={1.5} />
                )}
              </div>
              <h2 className="text-xl font-bold text-[#434343] font-serif">{docente.nombre}</h2>
              <p className="text-[#9CA98C] font-bold font-sans">{docente.titulo}</p>
            </div>

            {/* Información Rápida */}
            <div className="bg-white p-6 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
              style={{ 
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
              }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#9CA98C]" strokeWidth={2.5} />
                  <div>
                    <p className="font-bold text-[#434343] text-sm">Experiencia</p>
                    <p className="text-[#434343]/70 text-sm">{docente.experiencia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#9CA98C]" strokeWidth={2.5} />
                  <div>
                    <p className="font-bold text-[#434343] text-sm">Especialidad</p>
                    <p className="text-[#434343]/70 text-sm">{docente.especialidad}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#9CA98C]" strokeWidth={2.5} />
                  <div>
                    <p className="font-bold text-[#434343] text-sm">Formación</p>
                    <p className="text-[#434343]/70 text-sm">{docente.formacion[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Especialidad */}
            <div className="bg-gradient-to-br from-[#434343] to-[#666666] text-white p-6 rounded-2xl shadow-2xl"
              style={{ 
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
              }}>
              <h3 className="font-bold mb-3 font-serif">Área de Especialización</h3>
              <p className="text-blue-100 font-sans">{docente.especialidad}</p>
            </div>
          </motion.div>

          {/* Contenido Principal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Descripción */}
            <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}>
              <h2 className="text-2xl font-bold text-[#434343] mb-4 font-serif flex items-center gap-3">
                <Users className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                Perfil Profesional
              </h2>
              <p className="text-[#434343]/70 font-sans leading-relaxed text-lg">
                {docente.descripcionCompleta || 'Información profesional del docente.'}
              </p>
            </div>

            {/* Materias */}
            {docente.materias && docente.materias.length > 0 && (
              <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
                style={{ 
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                }}>
                <h2 className="text-2xl font-bold text-[#434343] mb-6 font-serif flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                  Materias que Imparte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docente.materias.map((materia: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#F4F1EA]/50 rounded-lg">
                      <div className="w-2 h-2 bg-[#9CA98C] rounded-full flex-shrink-0" />
                      <span className="text-[#434343] font-sans">{materia}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logros y Reconocimientos */}
            {docente.logros && docente.logros.length > 0 && (
              <div className="bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] text-white p-8 shadow-2xl rounded-2xl"
                style={{ 
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                }}>
                <h2 className="text-2xl font-bold mb-6 font-serif flex items-center gap-3">
                  <Trophy className="w-6 h-6" strokeWidth={2.5} />
                  Logros y Reconocimientos
                </h2>
                <div className="space-y-3">
                  {docente.logros.map((logro: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-white flex-shrink-0" strokeWidth={2.5} />
                      <span className="font-sans">{logro}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información de Contacto */}
            {docente.contacto && (
              <div className="bg-white p-8 shadow-2xl border-2 border-[#9CA98C]/20 rounded-2xl"
                style={{ 
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                }}>
                <h2 className="text-2xl font-bold text-[#434343] mb-4 font-serif flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#9CA98C]" strokeWidth={2.5} />
                  Información de Contacto
                </h2>
                <p className="text-[#434343]/70 font-sans leading-relaxed">
                  {docente.contacto}
                </p>
              </div>
            )}

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContacto}
              className="w-full bg-gradient-to-r from-[#434343] to-[#666666] hover:from-[#9CA98C] hover:to-[#7D8A6E] text-white py-4 font-bold transition-all duration-300 font-sans text-lg shadow-2xl flex items-center justify-center gap-3"
              style={{ 
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
              }}
            >
              <Phone className="w-5 h-5" strokeWidth={2.5} />
              Solicitar Contacto por WhatsApp
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}