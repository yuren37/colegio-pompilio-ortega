// components/CarrerasSection.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Clock, ArrowRight, CheckCircle2, GraduationCap, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Datos hardcodeados de carreras 
const carrerasData = [
  {
    id: 1,
    nombre: "Bachillerato en Ciencias y Humanidades",
    descripcion: "Formación integral con enfoque en ciencias básicas y desarrollo humano.",
    duracion: "2 años",
    area: "Ciencias",
    icono: "GraduationCap",
    color: "from-blue-500 to-purple-600",
    bgColor: "from-blue-50 to-purple-50",
    requisitos: [
      "Certificado de 9no grado",
      "Edad mínima: 15 años",
      "Promedio mínimo: 70%"
    ],
    url: "/carreras/ciencias-humanidades"
  },
  {
    id: 2,
    nombre: "Ciclo Común (7mo - 9no Grado)",
    descripcion: "Educación básica completa con formación en valores y habilidades esenciales.",
    duracion: "3 años",
    area: "Básica", 
    icono: "BookOpen",
    color: "from-green-500 to-teal-600",
    bgColor: "from-green-50 to-teal-50",
    requisitos: [
      "Certificado de 6to grado",

      "Documentación completa"
    ],
    url: "/carreras/ciclo-comun"
  },
  {
    id: 3,
    nombre: "BTP en Informática",
    descripcion: "Formación técnica especializada en tecnologías de la información y computación.",
    duracion: "3 años", 
    area: "Técnica",
    icono: "Cpu",
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-50",
    requisitos: [
      "Certificado de 9no grado",
      "Interés en tecnología",
      "Promedio mínimo: 75%"
    ],
    url: "/carreras/btp-informatica"
  }
];

// Mapeo de iconos
const iconosMap: { [key: string]: React.ComponentType<any> } = {
  'Cpu': require('lucide-react').Cpu,
  'GraduationCap': require('lucide-react').GraduationCap,
  'BookOpen': require('lucide-react').BookOpen
};

const areas = ["Todas", "Técnica", "Ciencias", "Básica"];

export default function CarrerasSection() {
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCarreras = carrerasData.filter(carrera => {
    const matchesArea = selectedArea === "Todas" || carrera.area === selectedArea;
    const matchesSearch = carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <section id="carreras" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] relative overflow-hidden">
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#9CA98C]/15 to-[#7D8A6E]/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-[#9CA98C]/20"
          >
            <div className="w-2 h-2 bg-[#9CA98C] rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-[#434343] uppercase tracking-wider">
              Programas Educativos
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#434343] mb-6 font-serif"
          >
            Nuestras <span className="bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] bg-clip-text text-transparent">Carreras</span>
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#434343]/70 max-w-3xl mx-auto font-sans leading-relaxed"
          >
            Formación académica de calidad con enfoque en tecnología, ciencias y desarrollo integral del estudiante
          </motion.p>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-6 mb-16"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#434343]/40" size={20} />
            <input
              type="text"
              placeholder="Buscar carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-[#9CA98C]/30 focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-2xl shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
            {areas.map((area) => (
              <motion.button
                key={area}
                onClick={() => setSelectedArea(area)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap font-sans rounded-xl ${
                  selectedArea === area
                    ? 'bg-[#434343] text-white shadow-lg'
                    : 'bg-white text-[#434343] border border-[#9CA98C]/30 hover:border-[#9CA98C] hover:shadow-md'
                }`}
              >
                {area}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid de carreras */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredCarreras.map((carrera, index) => {
            const IconoComponente = iconosMap[carrera.icono] || iconosMap['BookOpen'];
            
            return (
              <motion.div
                key={carrera.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-[#9CA98C]/20 rounded-2xl p-8 hover:shadow-xl hover:border-[#9CA98C] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                
                {/* Efecto de gradiente al hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${carrera.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  initial={false}
                />

                {/* Icono principal */}
                <motion.div 
                  className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${carrera.color} rounded-2xl mb-6 shadow-lg`}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <IconoComponente className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Contenido */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-[#434343] mb-4 font-serif group-hover:text-[#9CA98C] transition-colors duration-300">
                    {carrera.nombre}
                  </h3>
                  
                  <p className="text-[#434343]/70 mb-6 font-sans leading-relaxed">
                    {carrera.descripcion}
                  </p>
                  
                  {/* Información */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-[#9CA98C]/20">
                    <div className="flex items-center gap-3 text-[#434343]/70 font-sans">
                      <Clock className="w-5 h-5 text-[#9CA98C]" />
                      <span className="font-medium">{carrera.duracion}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#434343]/70 font-sans">
                      <GraduationCap className="w-5 h-5 text-[#9CA98C]" />
                      <span className="font-medium">{carrera.area}</span>
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-[#434343] mb-3 uppercase tracking-wider">Requisitos</h4>
                    <div className="space-y-2">
                      {carrera.requisitos.slice(0, 2).map((req: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#434343]/70 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-[#9CA98C] flex-shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botón */}
                  <Link href={carrera.url}>
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#434343] text-white py-4 font-semibold hover:bg-[#9CA98C] transition-all duration-300 font-sans flex items-center justify-center gap-3 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Ver Programa Completo
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredCarreras.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white border border-[#9CA98C]/20 rounded-2xl mt-8"
          >
            <p className="text-xl text-[#434343]/70 font-sans">
              No se encontraron carreras con los filtros seleccionados
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}