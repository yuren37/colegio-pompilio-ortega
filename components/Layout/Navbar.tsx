'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, BookOpen, Home, GraduationCap, Users, FileText, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para navegación externa
  const handleExternalNavigation = (url: string) => {
    window.open(url, '_blank');
  };

  // Función para scroll suave (solo para secciones internas)
  const handleSmoothScroll = (href: string) => {
    if (href === '#inicio') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // BOTONES PRINCIPALES - PLAN LACRA
  const menuItems = [
  { label: 'Inicio', href: '#inicio', icon: Home, action: 'scroll' },
  { label: 'Carreras', href: '/carreras', icon: GraduationCap, action: 'internal' },
  { label: 'Docentes', href: '/docentes', icon: Users, action: 'internal' },
  { label: 'Matrícula', href: '#matricula', icon: FileText, action: 'scroll' },
];

const fullscreenItems = [
  { 
    label: 'Blog Institucional', 
    href: '/blog', 
    icon: BookOpen, 
    action: 'internal' 
  },
  { 
    label: 'Biblioteca', 
    href: '/biblioteca', 
    icon: Library, 
    action: 'internal' 
  },
];
  const logoVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotate: -180
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotate: 0
    }
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      clipPath: 'circle(0% at 50% 50%)'
    },
    visible: { 
      opacity: 1,
      clipPath: 'circle(100% at 50% 50%)'
    }
  };

  // Función unificada para manejar clicks
  const handleNavigation = (item: any) => {
    if (item.action === 'external') {
      window.open(item.href, '_blank');
    } else if (item.action === 'internal') {
      window.location.href = item.href;
    } else if (item.action === 'scroll') {
      handleSmoothScroll(item.href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(156,169,140,0.15)] border-b-2 border-[#9CA98C]/20'
          : 'bg-white/95 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="relative flex items-center justify-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              transition={{ duration: 1.5 }}
              onAnimationComplete={() => setLogoAnimationComplete(true)}
            >
              <motion.div 
                className="w-16 h-16 flex items-center justify-center bg-transparent rounded-xl overflow-hidden relative"
                initial="hidden"
                animate="visible"
                variants={logoVariants}
                transition={{ 
                  duration: 1.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {/* Imagen del logo */}
                <motion.div
                  className={`w-full h-full flex items-center justify-center transition-opacity duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: imageLoaded ? 1 : 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <Image 
                    src="/mongrama.png" 
                    alt="IPO Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                    onLoad={() => setImageLoaded(true)}
                    priority
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.p 
                className="font-bold text-lg text-[#434343] font-serif leading-tight group-hover:text-[#9CA98C] transition-colors duration-300"
              >
                Excelencia Educativa
              </motion.p>
            </motion.div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navegación principal */}
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative px-5 py-2 text-[#434343] hover:text-[#9CA98C] font-bold transition-colors duration-300 font-sans group text-sm tracking-wide flex items-center space-x-2"
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span>{item.label}</span>
                  
                  {/* Línea inferior animada */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </motion.button>
              );
            })}
            
            {/* Separador */}
            <div className="h-6 w-px bg-[#9CA98C]/30 mx-2"></div>
            
            {/* Secciones Fullscreen (Biblioteca + Blog) */}
            {fullscreenItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-2 px-4 py-2 text-[#434343] hover:text-[#9CA98C] font-bold transition-colors duration-300 font-sans group text-sm tracking-wide relative"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                  
                  {/* Línea inferior animada */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </motion.button>
              );
            })}
            
            {/* CTA Button */}
            <motion.button
              onClick={() => handleNavigation({ href: '#matricula', action: 'scroll' })}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="ml-4 relative px-7 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold transition-all duration-300 hover:shadow-[0_8px_24px_rgba(67,67,67,0.3)] font-sans text-sm tracking-wide overflow-hidden group"
              style={{ 
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                INSCRÍBETE AHORA
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={3} />
              </span>
              
              {/* Overlay animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#9CA98C] to-[#7D8A6E]"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>

          {/* Botón Mobile Menu */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#434343] hover:text-[#9CA98C] transition-colors relative z-50"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-7 h-7" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-7 h-7" strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#434343]/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white/98 backdrop-blur-xl shadow-2xl md:hidden overflow-y-auto border-l-2 border-[#9CA98C]/20"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)'
              }}
            >
              <div className="p-8 pt-24">
                {/* Logo en mobile */}
                <div className="mb-8 pb-8 border-b-2 border-[#9CA98C]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-transparent rounded-lg overflow-hidden">
                      <Image 
                        src="/mongrama.png" 
                        alt="IPO Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <p className="font-bold text-[#434343] font-serif text-sm leading-tight">
                      Excelencia Educativa
                    </p>
                  </div>
                </div>

                {/* Menu Items Principal */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-bold text-[#9CA98C] uppercase tracking-wider px-4 mb-2">Navegación</h3>
                  {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => handleNavigation(item)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="flex items-center justify-between px-4 py-4 text-[#434343] hover:text-white font-bold transition-all duration-300 font-sans group bg-[#F4F1EA]/50 hover:bg-gradient-to-r hover:from-[#9CA98C] hover:to-[#7D8A6E] w-full text-left"
                        style={{ 
                          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Secciones Fullscreen */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xs font-bold text-[#9CA98C] uppercase tracking-wider px-4 mb-2">Recursos</h3>
                  {fullscreenItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => handleNavigation(item)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between px-4 py-4 text-[#434343] hover:text-white font-bold transition-all duration-300 font-sans group bg-[#F4F1EA]/50 hover:bg-gradient-to-r hover:from-[#9CA98C] hover:to-[#7D8A6E] w-full text-left"
                        style={{ 
                          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* CTA Mobile */}
                <motion.button
                  onClick={() => handleNavigation({ href: '#matricula', action: 'scroll' })}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="block text-center px-6 py-4 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans shadow-lg w-full"
                  style={{ 
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                  }}
                >
                  INSCRÍBETE AHORA
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}