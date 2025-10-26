// app/blog/dashboard/create-post/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Tag, Save } from 'lucide-react';
import { blogStorage } from '@/lib/blogStorage';

// ImageUpload component 
function ImageUpload({ currentImage, onImageUpload }: { 
  currentImage?: string; 
  onImageUpload: (url: string) => void; 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      const objectUrl = URL.createObjectURL(file);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onImageUpload(objectUrl);
    } catch (err) {
      setError('Error al subir la imagen. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    if (currentImage?.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage);
    }
    onImageUpload('');
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-[#9CA98C]"
            style={{ 
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            style={{ 
              clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
          ${isUploading 
            ? 'border-[#9CA98C] bg-[#9CA98C]/10' 
            : 'border-gray-300 hover:border-[#9CA98C] hover:bg-[#9CA98C]/5'
          }
        `}
        style={{ 
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-[#9CA98C] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-800 font-sans">Subiendo imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-[#9CA98C] mb-2" />
            <p className="text-sm font-medium text-gray-800 mb-1 font-sans">
              Arrastra una imagen o haz clic para subir
            </p>
            <p className="text-xs text-gray-600 font-sans">
              PNG, JPG, WEBP, GIF (Máx. 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded font-sans">{error}</p>
      )}
    </div>
  );
}

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: 'Administración',
    imageUrl: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Por favor, ingresa un título para el post');
      return;
    }
    
    if (!formData.excerpt.trim()) {
      alert('Por favor, ingresa un extracto para el post');
      return;
    }

    setIsLoading(true);

    try {
      // Crear post temporal con contenido vacío - CON AWAIT
      const tempPost = await blogStorage.createPost({
        ...formData,
        content: '<p>¡Comienza a escribir tu contenido aquí!</p>',
        published: false
      });

      // Redirigir a la página de edición de contenido
      router.push(`/blog/dashboard/edit-content/${tempPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear el post. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
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
            <h1 className="text-3xl font-bold text-gray-900 font-serif">
              Crear Nuevo Post
            </h1>
            <p className="text-gray-700 font-sans">
              Paso 1: Configura los detalles básicos del post
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Imagen de Portada */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4 font-sans">
                🖼️ Imagen de Portada
              </label>
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 font-sans">
                📝 Título del Post *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800 text-lg"
                placeholder="Escribe un título atractivo para tu post"
                required
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              />
            </div>

            {/* Extracto */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 font-sans">
                📄 Extracto o Descripción *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans resize-none text-gray-800"
                placeholder="Describe brevemente de qué trata tu post. Esto se mostrará en la lista de posts."
                required
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 font-sans">
                ✍️ Autor *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800"
                required
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              />
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 font-sans">
                🏷️ Etiquetas
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar etiqueta (presiona Enter)"
                  className="flex-1 px-4 py-2 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800"
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
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#9CA98C]/10 text-gray-800 rounded-full text-sm"
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

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border-2 border-[#9CA98C] text-[#9CA98C] font-bold hover:bg-[#9CA98C] hover:text-white transition-all duration-300 font-sans text-lg"
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.excerpt.trim()}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Continuar a Editar Contenido →
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}