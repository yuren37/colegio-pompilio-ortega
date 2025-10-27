// app/blog/dashboard/components/PostList.tsx
'use client';

import { BlogPost } from '@/lib/blogStorage';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, EyeOff, Calendar, User } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
}

export default function PostList({ posts, onEdit, onDelete, onTogglePublish }: PostListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
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
              <h3 className="text-xl font-bold text-[#434343] mb-2 font-serif group-hover:text-[#9CA98C] transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-[#434343]/70 mb-3 font-sans line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-[#434343]/60 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate (post. createdAt.toString()) }</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  post.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Publicado' : 'Borrador'}
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
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onTogglePublish(post.id, !post.published)}
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
                onClick={() => onEdit(post)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300"
                style={{ 
                  clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
                }}
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDelete(post.id)}
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
          className="text-center py-12 text-[#434343]/60 font-sans"
        >
          <p className="text-lg">No hay posts creados aún.</p>
          <p className="text-sm">¡Crea tu primer post haciendo clic en el botón "Nuevo Post"!</p>
        </motion.div>
      )}
    </div>
  );
}