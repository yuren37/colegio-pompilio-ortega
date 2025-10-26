// app/docentes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, GraduationCap, Trophy, Star, ChevronRight } from 'lucide-react';
import { docentesStorage } from '@/lib/docentesStorage';
import { Docente, Fundador } from '@/types/docente';

// Mapeo de íconos
const iconosMap: { [key: string]: React.ComponentType<any> } = {
  Users: Users,
  BookOpen: BookOpen,
  GraduationCap: GraduationCap,
  Award: Award,
  Trophy: Trophy,
};

export default function Docentes() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [fundador, setFundador] = useState<Fundador | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = () => {
      try {
        const docentesData = docentesStorage.getDocentes();
        const fundadorData = docentesStorage.getFundador();
        
        setDocentes(docentesData);
        setFundador(fundadorData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setDocentes([]);
        setFundador(null);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#434343]">Cargando docentes...</p>
        </div>
      </div>
    );
  }

  if (!fundador && docentes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay datos de docentes</h2>
          <p className="text-gray-600">Los datos de docentes aparecerán aquí cuando estén disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-[#434343] mb-4 font-serif"
        >
          Nuestro <span className="text-[#9CA98C]">Equipo Docente</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#434343]/70 max-w-2xl mx-auto"
        >
          Profesionales comprometidos con la excelencia educativa
        </motion.p>
      </div>

      {/* Fundador */}
      {fundador && (
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-[#9CA98C]/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#434343] mb-2">Nuestro Fundador</h2>
              <div className="w-20 h-1 bg-[#9CA98C] mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                  {fundador.foto ? (
                    <img src={fundador.foto} alt={fundador.nombre} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Users className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-[#434343] mb-2">{fundador.nombre}</h3>
                <p className="text-[#9CA98C] font-semibold mb-4">{fundador.titulo}</p>
                <p className="text-[#434343]/70 mb-4">{fundador.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {fundador.reconocimientos.map((reconocimiento, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-[#434343]/70">
                      <Award className="w-4 h-4 text-[#9CA98C]" />
                      {reconocimiento}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lista de Docentes */}
      {docentes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#434343] text-center mb-8 font-serif"
          >
            Nuestros Docentes
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docentes.map((docente, index) => {
              const IconComponent = iconosMap[docente.icono] || Users;
              
              return (
                <motion.div
                  key={docente.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-[#9CA98C]/20 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => window.location.href = `/docentes/${docente.id}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${docente.color} bg-gradient-to-r`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#434343] group-hover:text-[#9CA98C] transition-colors">
                        {docente.nombre}
                      </h3>
                      <p className="text-sm text-[#9CA98C] font-semibold">{docente.titulo}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA98C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-[#434343]/70 text-sm mb-3">{docente.formacion}</p>
                  
                  <div className="flex items-center justify-between text-sm text-[#434343]/60">
                    <span>{docente.experiencia}</span>
                    <span className="bg-[#9CA98C]/10 text-[#9CA98C] px-2 py-1 rounded-full text-xs">
                      {docente.especialidad}
                    </span>
                  </div>

                  {docente.materias.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {docente.materias.slice(0, 2).map((materia, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {materia}
                        </span>
                      ))}
                      {docente.materias.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{docente.materias.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}