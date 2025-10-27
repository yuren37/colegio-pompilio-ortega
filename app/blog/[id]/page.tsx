// app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon, ArrowLeft, BookOpen } from 'lucide-react';
import { blogStorage, BlogPost } from '@/lib/blogStorage';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string);
    }
  }, [params.id]);

  const loadPost = (id: string) => {
    try {
      const postData = blogStorage.getPostById(id);
      if (!postData || !postData.published) {
        router.push('/blog');
        return;
      }
      setPost(postData);
    } catch (error) {
      console.error('Error loading post:', error);
      router.push('/blog');
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
          <p className="text-[#434343] font-sans">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#9CA98C]/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#434343] mb-4 font-serif">Artículo no encontrado</h2>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#9CA98C] text-white hover:bg-[#7D8A6E] transition-all duration-300 font-bold font-sans"
            style={{ 
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-[#434343] to-[#666666] text-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-sans">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
<span className="font-sans">{formatDate(post.createdAt.toString())}</span>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-sans"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 md:p-12 border-2 border-[#9CA98C]/20 shadow-lg"
          style={{ 
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
          }}
        >
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#434343] prose-p:text-[#434343]/80 prose-p:font-sans prose-li:text-[#434343]/80 prose-strong:text-[#434343] prose-a:text-[#9CA98C] hover:prose-a:text-[#7D8A6E]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-12 pt-8 border-t-2 border-[#9CA98C]/20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Link>
          </div>
        </motion.article>
      </main>
    </div>
  );
}