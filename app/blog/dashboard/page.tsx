'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, LogOut, BookOpen, Eye, EyeOff, X, Tag, Edit, Trash2, Upload, 
  Image as ImageIcon, Users, GraduationCap, FileText, BarChart3, ArrowRight,
  Home
} from 'lucide-react';
import { blogStorage, BlogPost } from '@/lib/blogStorage';
import { docentesStorage } from '@/lib/docentesStorage';
import { carrerasStorage } from '@/lib/carrerasStorage';
import TipTapEditor from '@/components/admin/TipTapEditor';

// Componente ImageUpload 
function ImageUpload({ currentImage, onImageUpload }: { 
  currentImage?: string; 
  onImageUpload: (url: string) => void; 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 AGREGAR: Función para detener propagación
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 AGREGAR
    if (currentImage?.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage);
    }
    onImageUpload('');
  };

  return (
    <div className="space-y-4" onClick={stopPropagation}> {/* 🔥 AGREGAR */}
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
            onClick={removeImage} // 🔥 YA TIENE stopPropagation
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
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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
        onClick={(e) => {
          stopPropagation(e); // 🔥 AGREGAR
          fileInputRef.current?.click();
        }}
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

// Componente Modal del Formulario
function PostFormModal({ post, onSave, onCancel }: { 
  post: BlogPost | null; 
  onSave: (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '<h1>¡Comienza a escribir tu contenido épico aquí! 😊</h1><p>Editor profesional nivel Word - Puedes agregar imágenes, tablas, videos y mucho más.</p>',
    excerpt: post?.excerpt || '',
    author: post?.author || 'Administración',
    published: post?.published || false,
    imageUrl: post?.imageUrl || '',
    tags: post?.tags || []
  });
  const [newTag, setNewTag] = useState('');

  // 🔥 AGREGAR: Función para detener propagación
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Por favor, ingresa un título para el post');
      return;
    }
    
    if (!formData.excerpt.trim()) {
      alert('Por favor, ingresa un extracto para el post');
      return;
    }

    onSave(formData);
  };

  const addTag = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 AGREGAR
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 AGREGAR
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel} // 🔥 ESTE SE MANTIENE - cierra al hacer click en el fondo
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border-2 border-[#9CA98C]/20"
        style={{ 
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
        }}
        onClick={stopPropagation} // 🔥 AGREGAR: Prevenir cierre al hacer click en el modal
      >
        <div className="bg-gradient-to-r from-[#434343] to-[#666666] p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white font-serif">
            {post ? 'Editar Post' : 'Crear Nuevo Post'}
          </h2>
          <button
            onClick={(e) => {
              stopPropagation(e); // 🔥 AGREGAR
              onCancel();
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto" onClick={stopPropagation}>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Imagen de Portada
            </label>
            <ImageUpload
              currentImage={formData.imageUrl}
              onImageUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              onClick={stopPropagation} // 🔥 AGREGAR
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800"
              placeholder="Ingresa el título del post"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Extracto *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              onClick={stopPropagation} // 🔥 AGREGAR
              rows={3}
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans resize-none text-gray-800"
              placeholder="Breve descripción del post (se muestra en la lista de posts)"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Contenido *
            </label>
            <div onClick={stopPropagation}> {/* 🔥 AGREGAR contenedor alrededor del editor */}
              <TipTapEditor
                content={formData.content}
                onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 font-sans">
              Editor profesional - Puedes agregar imágenes, tablas, videos y mucho más.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Autor *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              onClick={stopPropagation} // 🔥 AGREGAR
              className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800"
              required
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 font-sans">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2" onClick={stopPropagation}> {/* 🔥 AGREGAR */}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                onClick={stopPropagation} // 🔥 AGREGAR
                placeholder="Nueva etiqueta"
                className="flex-1 px-4 py-2 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans text-gray-800"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              />
              <button
                type="button"
                onClick={addTag} // 🔥 YA TIENE stopPropagation
                className="px-4 py-2 bg-[#9CA98C] text-white rounded-lg hover:bg-[#7D8A6E] transition-colors duration-300 flex items-center gap-2"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2" onClick={stopPropagation}> {/* 🔥 AGREGAR */}
              {formData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#9CA98C]/10 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => removeTag(tag, e)} // 🔥 YA TIENE stopPropagation
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3" onClick={stopPropagation}> {/* 🔥 AGREGAR */}
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              onClick={stopPropagation} // 🔥 AGREGAR
              className="w-4 h-4 text-[#9CA98C] focus:ring-[#9CA98C] border-[#9CA98C]/30 rounded"
            />
            <label htmlFor="published" className="text-sm font-bold text-gray-800 font-sans">
              Publicar inmediatamente
            </label>
          </div>

          <div className="flex gap-4 pt-4" onClick={stopPropagation}> {/* 🔥 AGREGAR */}
            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e); // 🔥 AGREGAR
                onCancel();
              }}
              className="flex-1 px-6 py-3 border-2 border-[#9CA98C] text-[#9CA98C] font-bold hover:bg-[#9CA98C] hover:text-white transition-all duration-300 font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={stopPropagation} // 🔥 AGREGAR
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              {post ? 'Actualizar' : 'Crear Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// El resto del código de DashboardPage se mantiene exactamente igual...
export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Nuevos estados para estadísticas
  const [postsCount, setPostsCount] = useState(0);
  const [docentesCount, setDocentesCount] = useState(0);
  const [carrerasCount, setCarrerasCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    
    const isAuthenticated = localStorage.getItem('blog-auth') === 'true';
    if (!isAuthenticated) {
      router.push('/blog/dashboard/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = () => {
    try {
      const postsData = blogStorage.getPosts();
      const docentesData = docentesStorage.getDocentes();
      const carrerasData = carrerasStorage.getCarreras();
      
      setPosts(postsData);
      setPostsCount(postsData.length);
      setDocentesCount(docentesData.length);
      setCarrerasCount(carrerasData.length);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('blog-auth');
    router.push('/blog/dashboard/login');
  };

 // En tu DashboardPage principal, cambia:
const handleCreatePost = () => {
  router.push('/blog/dashboard/create-post');
};

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      const success = blogStorage.deletePost(id);
      if (success) {
        loadData();
      }
    }
  };

  const handleTogglePublish = (id: string) => {
    const updatedPost = blogStorage.togglePublish(id);
    if (updatedPost) {
      loadData();
    }
  };

  const handleSavePost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPost) {
      blogStorage.updatePost(editingPost.id, postData);
    } else {
      blogStorage.createPost(postData);
    }
    setShowForm(false);
    setEditingPost(null);
    loadData();
  };

  // Funciones de navegación
  const handleEditDocentes = () => {
    window.location.href = '/admin/docentes';
  };

  const handleEditCarreras = () => {
    window.location.href = '/admin/carreras';
  };

  const handleViewBlog = () => {
    window.location.href = '/blog';
  };

  const handleViewWebsite = () => {
    window.location.href = '/';
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-sans">Cargando...</p>
        </div>
      </div>
    );
  }

  const blogStats = {
    total: posts.length,
    published: posts.filter(post => post.published).length,
    drafts: posts.filter(post => !post.published).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">
              Panel de Control
            </h1>
            <p className="text-gray-700 font-sans">
              Gestiona todo el contenido del sitio web
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleViewWebsite}
              className="flex items-center gap-2 px-6 py-3 bg-[#9CA98C] text-white hover:bg-[#7D8A6E] transition-all duration-300 font-bold font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              <Home className="w-4 h-4" />
              Ver Sitio Web
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 font-bold font-sans"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </motion.header>

        {/* Estadísticas Generales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-lg"
            style={{ 
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 font-serif">{postsCount}</p>
                <p className="text-gray-700 font-sans">Artículos del Blog</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg"
            style={{ 
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 font-serif">{docentesCount}</p>
                <p className="text-gray-700 font-sans">Docentes Activos</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-lg"
            style={{ 
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                style={{ 
                  clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                }}
              >
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 font-serif">{carrerasCount}</p>
                <p className="text-gray-700 font-sans">Programas Educativos</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Herramientas de Gestión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
            Herramientas de Gestión
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gestión del Blog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => router.push('/blog/dashboard/posts')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 font-serif">
                Gestión del Blog
              </h3>
              <p className="text-white/90 text-sm font-sans leading-relaxed">
                Crea y edita artículos, gestiona categorías y publica contenido educativo
              </p>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                <div className="flex-1">
                  <p className="text-white/80 text-xs font-sans">Artículos publicados</p>
                  <p className="text-white font-semibold font-sans">
                    {postsCount} posts
                  </p>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-lg">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Gestión de Docentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={handleEditDocentes}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 font-serif">
                Gestión de Docentes
              </h3>
              <p className="text-white/90 text-sm font-sans leading-relaxed">
                Administra el equipo académico, información profesional y fotografías
              </p>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                <div className="flex-1">
                  <p className="text-white/80 text-xs font-sans">Docentes activos</p>
                  <p className="text-white font-semibold font-sans">
                    {docentesCount} profesores
                  </p>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-lg">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Gestión de Carreras */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#9CA98C] to-[#7D8A6E] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={handleEditCarreras}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 font-serif">
                Gestión de Carreras
              </h3>
              <p className="text-white/90 text-sm font-sans leading-relaxed">
                Administra los programas educativos, planes de estudio y beneficios de cada carrera
              </p>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                <div className="flex-1">
                  <p className="text-white/80 text-xs font-sans">Carreras activas</p>
                  <p className="text-white font-semibold font-sans">
                    {carrerasCount} programas
                  </p>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-lg">
                  <span className="text-white text-xs font-semibold">Nuevo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-300 group"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 font-sans">Nuevo Artículo</p>
                <p className="text-gray-700 text-sm font-sans">Crear post</p>
              </div>
            </button>

            <button
              onClick={handleEditDocentes}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-300 group"
            >
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 font-sans">Agregar Docente</p>
                <p className="text-gray-700 text-sm font-sans">Nuevo profesor</p>
              </div>
            </button>

            <button
              onClick={handleEditCarreras}
              className="flex items-center gap-3 p-4 bg-[#9CA98C]/10 hover:bg-[#9CA98C]/20 rounded-xl transition-colors duration-300 group"
            >
              <div className="p-2 bg-[#9CA98C] rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 font-sans">Nueva Carrera</p>
                <p className="text-gray-700 text-sm font-sans">Agregar programa</p>
              </div>
            </button>

            <button
              onClick={handleViewBlog}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-300 group"
            >
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 font-sans">Ver Blog</p>
                <p className="text-gray-700 text-sm font-sans">Ir al blog público</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Gestión de Posts (Sección existente) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              Gestión de Posts del Blog
            </h2>
            <motion.button
              onClick={handleCreatePost}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#434343] to-[#666666] text-white font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans shadow-lg hover:shadow-xl"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              <Plus className="w-5 h-5" />
              Nuevo Post
            </motion.button>
          </div>

          {/* Lista de Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-[#9CA98C]/20 rounded-xl p-6 hover:border-[#9CA98C] transition-all duration-300 group shadow-sm hover:shadow-md"
                style={{ 
                  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif group-hover:text-[#9CA98C] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-3 font-sans">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Por: {post.author}</span>
                      <span>Creado: {new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </div>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#9CA98C]/10 text-gray-800 rounded text-xs font-sans"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg ml-4"
                    />
                  )}

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        post.published
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                      style={{ 
                        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
                      }}
                      title={post.published ? 'Despublicar' : 'Publicar'}
                    >
                      {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300"
                      style={{ 
                        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
                      }}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
                      style={{ 
                        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-600 font-sans"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#9CA98C]/40" />
                <p className="text-lg">No hay posts creados aún.</p>
                <p className="text-sm">¡Crea tu primer post haciendo clic en el botón "Nuevo Post"!</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Formulario Modal */}
        {showForm && (
          <PostFormModal
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
}