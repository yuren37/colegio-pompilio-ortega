// app/blog/dashboard/components/PostForm.tsx
'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/blogStorage';
import { motion } from 'framer-motion';
import { X, Plus, Tag } from 'lucide-react';

interface PostFormProps {
  post?: BlogPost;
  onSubmit: (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function PostForm({ post, onSubmit, onCancel, isSubmitting }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    author: post?.author || '',
    published: post?.published || false,
    imageUrl: post?.imageUrl || '',
    tags: post?.tags || []
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-[#9CA98C]/20"
        style={{ 
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#434343] to-[#666666] p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white font-serif">
            {post ? 'Editar Post' : 'Crear Nuevo Post'}
          </h2>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          {/* Extracto */}
          <div>
            <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
              Extracto *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans resize-none"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
              Contenido *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans resize-none"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
              Autor *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Nueva etiqueta"
                className="flex-1 px-4 py-2 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors duration-300 flex items-center gap-2"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <Plus className="w-4 h-4" />
                <Tag className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#9CA98C]/10 text-[#434343] rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Publicado */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 text-[#9CA98C] focus:ring-[#9CA98C] border-[#9CA98C]/30 rounded"
            />
            <label htmlFor="published" className="text-sm font-bold text-[#434343] font-sans">
              Publicar inmediatamente
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-[#9CA98C] text-[#9CA98C] font-bold hover:bg-[#9CA98C] hover:text-white transition-all duration-300 font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              {isSubmitting ? 'Guardando...' : (post ? 'Actualizar' : 'Crear Post')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}