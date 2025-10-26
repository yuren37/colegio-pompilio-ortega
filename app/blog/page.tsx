// app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon, ArrowRight, BookOpen } from 'lucide-react';
import { blogStorage, BlogPost } from '@/lib/blogStorage';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const publishedPosts = blogStorage.getPublishedPosts();
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#434343] font-sans">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
      {/* Header del Blog */}
      <header className="relative bg-gradient-to-r from-[#434343] to-[#666666] text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            >
              Blog Educativo
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Descubre artículos, noticias y recursos educativos del Instituto Pompilio Ortega
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-[#9CA98C]/20 shadow-sm"
            style={{ 
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}
          >
            <BookOpen className="w-5 h-5 text-[#9CA98C]" />
            <span className="text-[#434343] font-bold font-sans">
              {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'} publicado{posts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* Grid de Posts */}
        {posts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl overflow-hidden border-2 border-[#9CA98C]/20 hover:border-[#9CA98C] transition-all duration-300 shadow-lg hover:shadow-xl group"
                style={{ 
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
                }}
              >
                {/* Imagen del post */}
                <div className="h-48 bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#434343] rounded text-xs font-bold font-sans"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contenido del post */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#434343] mb-3 font-serif group-hover:text-[#9CA98C] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-[#434343]/70 mb-4 font-sans line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Metadatos */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-4 text-sm text-[#434343]/60">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#9CA98C]/10 text-[#434343] rounded text-xs font-sans"
                        >
                          <TagIcon className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Botón Leer Más */}
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans group/btn"
                    style={{ 
                      clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                    }}
                  >
                    Leer Más
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-24 h-24 text-[#9CA98C]/40 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#434343] mb-4 font-serif">
              No hay artículos publicados
            </h3>
            <p className="text-[#434343]/70 font-sans max-w-md mx-auto">
              Próximamente compartiremos artículos educativos, noticias y recursos importantes para nuestra comunidad estudiantil.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}