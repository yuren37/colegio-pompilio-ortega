// app/admin/editor/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CKEditorGold from '@/components/admin/CKEditorGold';

export default function EditorPage() {
  const router = useRouter();
  const [content, setContent] = useState('<h1>¡Bienvenido al Editor Profesional! 🚀</h1><p>Comienza a crear tu contenido épico aquí...</p>');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // Aquí guardarías el contenido en tu base de datos
    console.log('Guardando contenido:', { title, description, content });
    alert('¡Contenido guardado correctamente!');
  };

  const handlePublish = () => {
    // Lógica para publicar
    console.log('Publicando:', { title, description, content });
    alert('¡Contenido publicado!');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editor Profesional</h1>
              <p className="text-gray-600 mt-2">Crea contenido épico con nuestro editor de nivel Word</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Volver
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                💾 Guardar
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🚀 Publicar
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de metadatos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del contenido *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingresa un título atractivo..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción breve
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el contenido..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">📋 Acciones rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                📥 Guardar como borrador
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                👁️ Vista previa
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                🕒 Programar publicación
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                📊 Estadísticas
              </button>
            </div>
          </div>
        </div>

        {/* Editor en pantalla completa */}
        <div className="bg-white rounded-lg border border-gray-200 p-1">
          <CKEditorGold
            content={content}
            onChange={setContent}
            fullScreen={false}
          />
        </div>

        {/* Footer con estadísticas */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-6">
              <span>📝 Caracteres: {content.replace(/<[^>]*>/g, '').length}</span>
              <span>📄 Palabras: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</span>
              <span>🖼️ Imágenes: {(content.match(/<img/g) || []).length}</span>
              <span>📊 Tablas: {(content.match(/<table/g) || []).length}</span>
            </div>
            <div className="text-green-600 font-medium">
              ✅ Guardado automático activado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}