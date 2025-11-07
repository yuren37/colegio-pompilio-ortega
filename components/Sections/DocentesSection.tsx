// components/Sections/DocentesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, BookOpen, Star, Award, Languages, Cpu, Calculator, Palette, Users, Heart, Crown } from 'lucide-react';
import Link from 'next/link';

// Solo los datos básicos que necesitas
const docentesData = [
  {
    slug: "nury-castillo",
    nombre: "Nury Castillo",
    especialidad: "Psicología y Pedagogía", 
    titulo: "Licenciatura en Español",
    experiencia: "Amplia experiencia laboral",
    clases: ["Orientación Vocacional", "Español", "Tecnología", "Psicología"],
    icono: Heart,
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-50",
    area: "Humanidades"
  },
  {
    slug: "fausto-castillo",
    nombre: "Fausto Castillo",
    especialidad: "Matemáticas",
    titulo: "Maestría en Matemática Educativa",
    experiencia: "Especialista en educación superior", 
    clases: ["Matemáticas", "Física Elemental"],
    icono: Calculator,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    area: "Ciencias"
  },
  {
    slug: "wilson-madrid", 
    nombre: "Wilson Madrid",
    especialidad: "Ciencias Sociales y Arte",
    titulo: "Licenciado en Estudios Sociales/Director",
    experiencia: "Amplia Experiencia edicativa en multiples centros de educacion y componentes artisticos",
    clases: ["Sociales", "Antropología", "Filosofía", "Arte"],
    icono: Palette,
    color: "from-purple-500 to-indigo-600",
    bgColor: "from-purple-50 to-indigo-50",
    area: "Humanidades"
  },
  {
    slug: "jessica-pineda",
    nombre: "Jessica Pineda", 
    especialidad: "Idiomas",
    titulo: "Pedagogía con especialización en idiomas",
    experiencia: "Bilingüe - Enfoque comunicativo",
    clases: ["Idioma Extranjero"],
    icono: Languages,
    color: "from-green-500 to-emerald-600", 
    bgColor: "from-green-50 to-emerald-50",
    area: "Humanidades"
  },
  {
    slug: "francisco-altamirano",
    nombre: "Francisco Altamirano",
    especialidad: "Matemáticas e Informática",
    titulo: "Ingeniero en Sistemas", 
    experiencia: "Amplia experiencia en tecnología",
    clases: ["Matemáticas", "Informática", "Programación"],
    icono: Cpu,
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-50",
    area: "Tecnología"
  },
  {
    slug: "luis-rodriguez",
    nombre: "Luis Rodríguez",
    especialidad: "Ingeniería en Sistemas",
    titulo: "Ingeniero en Sistemas",
    experiencia: "Amplia experiencia en desarrollo web y sistemas",
    clases: ["Programación", "Análisis de Sistemas", "Diseño de Sistemas", "Legislación Aplicada", "Desarrollo Web"],
    icono: Cpu,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50", 
    area: "Tecnología"
  },
  {
    slug: "saul-palma",
    nombre: "Saul Palma",
    especialidad: "Ciencias Sociales y Agronomía",
    titulo: "Ingeniero Agrónomo - Lic. en Sociología",
    experiencia: "Amplia experiencia con ONGs",
    clases: ["Historia de Honduras", "Sociología", "Educación Cívica"],
    icono: Users,
    color: "from-teal-500 to-green-600",
    bgColor: "from-teal-50 to-green-50",
    area: "Humanidades"
  },
  {
    slug: "martha-nunez",
    nombre: "Martha Nuñez",
    especialidad: "Consejería y Tecnología", 
    titulo: "Especialista en orientación",
    experiencia: "Consejera estudiantil",
    clases: ["Tecnología", "Ética Profesional"],
    icono: Award,
    color: "from-yellow-500 to-amber-600",
    bgColor: "from-yellow-50 to-amber-50",
    area: "Tecnología"
  },
  {
    slug: "mercedes-amaya",
    nombre: "Mercedes Amaya",
    especialidad: "Administración e Idiomas",
    titulo: "Administradora - Especialista en idiomas", 
    experiencia: "Bilingüe - Gestión educativa",
    clases: ["Economía", "Idioma Extranjero"],
    icono: Languages,
    color: "from-indigo-500 to-purple-600",
    bgColor: "from-indigo-50 to-purple-50",
    area: "Humanidades"
  },
  {
    slug: "danilo-amaya",
    nombre: "Danilo Amaya",
    especialidad: "Liderazgo Educativo",
    titulo: "Fundador/Rector",
    experiencia: "Visión y dirección institucional", 
    clases: ["Liderazgo", "Gestión Educativa"],
    icono: Crown,
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50 to-orange-50",
    area: "Liderazgo"
  }
];

const areas = [
  { value: "todos", label: "Todos" },
  { value: "ciencias", label: "Ciencias" },
  { value: "humanidades", label: "Humanidades" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "liderazgo", label: "Liderazgo" }
];

export default function DocentesSection() {
  const [selectedArea, setSelectedArea] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocentes = docentesData.filter(docente => {
    const matchesArea = 
      selectedArea === "todos" || docente.area.toLowerCase() === selectedArea;
    
    const matchesSearch = 
      docente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesArea && matchesSearch;
  });

  return (
    <section id="docentes" className="py-20 bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header simple */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#434343] mb-6 font-serif"
          >
            Nuestros <span className="bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] bg-clip-text text-transparent">Docentes</span>
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#434343]/70 max-w-3xl mx-auto font-sans leading-relaxed"
          >
            Profesionales especializados comprometidos con la excelencia educativa
          </motion.p>
        </motion.div>

        {/* Filtros simples */}
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
              placeholder="Buscar docente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-[#9CA98C]/30 focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-2xl shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
            {areas.map((area) => (
              <motion.button
                key={area.value}
                onClick={() => setSelectedArea(area.value)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap font-sans rounded-xl ${
                  selectedArea === area.value
                    ? 'bg-[#434343] text-white shadow-lg'
                    : 'bg-white text-[#434343] border border-[#9CA98C]/30 hover:border-[#9CA98C] hover:shadow-md'
                }`}
              >
                {area.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid simple de docentes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          {filteredDocentes.map((docente, index) => {
            const IconComponent = docente.icono;
            
            return (
              <motion.div
                key={docente.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative bg-white border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                  docente.area === "Liderazgo" 
                    ? 'border-amber-400 shadow-lg' 
                    : 'border-[#9CA98C] hover:border-[#7D8A6E]'
                }`}
              >
                
                {/* Icono especial para liderazgo */}
                {docente.area === "Liderazgo" && (
                  <div className="absolute top-4 right-4 z-20">
                    <Crown className="w-6 h-6 text-amber-500" />
                  </div>
                )}

                {/* Efecto de gradiente al hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${docente.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  initial={false}
                />

                {/* Icono principal */}
                <motion.div 
                  className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${docente.color} rounded-2xl mb-4 shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Contenido */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-[#434343] mb-2 font-serif group-hover:text-[#9CA98C] transition-colors duration-300">
                    {docente.nombre}
                  </h3>
                  
                  <p className="text-[#434343]/70 text-sm mb-3 font-sans leading-relaxed">
                    {docente.especialidad}
                  </p>
                  
                  {/* Información */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-[#9CA98C]/20">
                    <div className="flex items-center gap-2 text-[#434343]/70 text-sm font-sans">
                      <Award className="w-4 h-4 text-[#9CA98C]" />
                      <span className="font-medium">{docente.titulo}</span>
                    </div>
                  </div>

                  {/* Clases que imparte */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[#434343] mb-2 uppercase tracking-wider">Clases</h4>
                    <div className="flex flex-wrap gap-1">
                      {docente.clases.slice(0, 3).map((clase, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-[#9CA98C]/10 text-[#434343] text-xs rounded-full font-sans"
                        >
                          {clase}
                        </span>
                      ))}
                      {docente.clases.length > 3 && (
                        <span className="px-2 py-1 bg-[#434343]/10 text-[#434343] text-xs rounded-full">
                          +{docente.clases.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón */}
                  <Link href={`/docentes/${docente.slug}`}>
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 font-semibold transition-all duration-300 font-sans flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl text-sm ${
                        docente.area === "Liderazgo"
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-[#434343] text-white hover:bg-[#9CA98C]'
                      }`}
                    >
                      Ver Perfil
                      <BookOpen className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredDocentes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm border border-[#9CA98C]/20 rounded-2xl mt-8"
          >
            <Users className="w-16 h-16 text-[#9CA98C] mx-auto mb-4" />
            <p className="text-xl text-[#434343]/70 font-sans">
              No se encontraron docentes con los filtros seleccionados
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}