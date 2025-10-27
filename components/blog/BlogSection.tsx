// components/blog/BlogSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

// Importa blogStorage
import { blogStorage, BlogPost } from '@/lib/blogStorage';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Usa getPublishedPosts() para obtener solo posts publicados
        const publishedPosts = blogStorage.getPublishedPosts();
        
        // Toma los 3 más recientes
        const recentPosts = publishedPosts.slice(0, 3);
        
        setPosts(recentPosts);
        
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#9CA98C]/10 rounded-full mb-4"
            >
              <BookOpen className="w-5 h-5 text-[#9CA98C]" />
              <span className="text-sm font-semibold text-[#434343]">Blog Educativo</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#434343] mb-4">
              Últimas Noticias
            </h2>
            <p className="text-lg text-[#434343]/70 max-w-2xl mx-auto">
              Mantente informado sobre nuestras últimas publicaciones y noticias educativas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#9CA98C]/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#434343]/5 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#9CA98C]/10 rounded-full mb-4 border border-[#9CA98C]/20"
          >
            <BookOpen className="w-5 h-5 text-[#9CA98C]" />
            <span className="text-sm font-semibold text-[#434343]">Blog Educativo</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-[#434343] mb-4 font-['Georgia',serif]"
          >
            Últimas Publicaciones
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-[#434343]/70 max-w-2xl mx-auto leading-relaxed"
          >
            Descubre artículos educativos, noticias institucionales y consejos para el éxito académico
          </motion.p>
        </motion.div>

        {/* Grid de Posts - CON ESTRUCTURA CORRECTA */}
        {posts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Imagen del post - USA imageUrl */}
                <div className="h-48 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] relative overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/80">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Tags como categorías */}
                  {post.tags && post.tags.length > 0 && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#434343] text-xs font-semibold rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Contenido del post */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#434343] mb-3 line-clamp-2 group-hover:text-[#9CA98C] transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#434343]/70 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta información */}
                  <div className="flex flex-col gap-3 text-sm text-[#434343]/60 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt.toString())}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#9CA98C]/10 text-[#434343] text-xs rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 bg-[#434343]/10 text-[#434343] text-xs rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Botón leer más */}
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-[#9CA98C] font-semibold hover:text-[#7D8A6E] transition-colors duration-300 group/btn"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#434343]/70 text-lg">No hay publicaciones disponibles en este momento.</p>
          </div>
        )}

        {/* Botón para ver más posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <BookOpen className="w-5 h-5" />
            Ver Todos los Artículos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}