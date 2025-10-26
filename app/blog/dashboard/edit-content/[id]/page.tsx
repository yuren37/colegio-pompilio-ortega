// app/blog/dashboard/edit-content/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { blogStorage, BlogPost } from '@/lib/blogStorage';
import TipTapEditor from '@/components/admin/TipTapEditor';

export default function EditPostContentPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const loadPost = () => {
      try {
        const postData = blogStorage.getPost(postId); // 🔥 Usando el nuevo método síncrono
        if (!postData) {
          alert('Post no encontrado');
          router.push('/blog/dashboard');
          return;
        }
        
        setPost(postData);
        setContent(postData.content);
        setIsPublished(postData.published);
      } catch (error) {
        console.error('Error loading post:', error);
        alert('Error al cargar el post');
        router.push('/blog/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, router]);

  const handleSave = async (publish: boolean = false) => { // 🔥 Mantenemos async
    if (!post) return;

    setIsSaving(true);

    try {
      const updatedPost = await blogStorage.updatePost(postId, { // 🔥 CON AWAIT
        title: post.title,
        excerpt: post.excerpt,
        author: post.author,
        imageUrl: post.imageUrl,
        tags: post.tags,
        content: content,
        published: publish
      });

      if (updatedPost) {
        setIsPublished(publish);
        if (publish) {
          alert('¡Post guardado y publicado exitosamente!');
          router.push('/blog/dashboard');
        } else {
          alert('¡Contenido guardado exitosamente!');
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = () => {
    if (isPublished) {
      handleSave(false);
    } else {
      if (confirm('¿Estás seguro de que quieres publicar este post? Será visible para todos los visitantes.')) {
        handleSave(true);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-sans">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA]">
      {/* Header Fijo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border-b-2 border-[#9CA98C]/20 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 bg-white rounded-lg border-2 border-[#9CA98C]/20 hover:border-[#9CA98C] transition-all duration-300"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <ArrowLeft className="w-5 h-5 text-[#9CA98C]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                  Editando: {post.title}
                </h1>
                <p className="text-gray-700 font-sans">
                  Paso 2: Escribe y formatea tu contenido
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Borrador
                  </>
                )}
              </button>

              <button
                onClick={handleTogglePublish}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-3 font-bold transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPublished
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-[#9CA98C] text-white hover:bg-[#7D8A6E]'
                }`}
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                {isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Despublicar
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publicar Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TipTapEditor
            content={content}
            onChange={setContent}
          />
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-sans">
              💡 <strong>Consejo:</strong> Usa el editor para agregar imágenes, videos, tablas y formatear tu contenido. 
              Puedes guardar como borrador o publicar directamente cuando termines.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}