// components/blog/ModernCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface ModernCardProps {
  title: string;
  description: string;
  href: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export default function ModernCard({
  title,
  description,
  href,
  category,
  author,
  date,
  readTime,
  featured = false
}: ModernCardProps) {
  return (
    <motion.article
      className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Imagen destacada */}
      <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Badge de categoría */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
            category === 'Académico' 
              ? 'bg-blue-500/90 text-white' 
              : category === 'Noticias'
              ? 'bg-purple-500/90 text-white'
              : category === 'Eventos'
              ? 'bg-orange-500/90 text-white'
              : category === 'Deportes'
              ? 'bg-red-500/90 text-white'
              : 'bg-green-500/90 text-white'
          }`}>
            {category}
          </span>
        </div>

        {/* Badge de destacado */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              Destacado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Meta información */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString('es-HN', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Título y descripción */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
          {title}
        </h3>

        <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>

        {/* Acción */}
        <Link 
          href={href}
          className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all group/link"
        >
          Leer artículo completo
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}