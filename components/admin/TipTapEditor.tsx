// components/admin/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Upload,
  X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const imageModalRef = useRef<HTMLDivElement>(null);
  const youtubeModalRef = useRef<HTMLDivElement>(null);
  const linkModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cerrar modales al hacer clic fuera - PERO NO DEL EDITOR
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el clic fue dentro del editor, no hacer nada
      if (editorContainerRef.current && editorContainerRef.current.contains(event.target as Node)) {
        return;
      }

      if (imageModalRef.current && !imageModalRef.current.contains(event.target as Node)) {
        setShowImageInput(false);
      }
      if (youtubeModalRef.current && !youtubeModalRef.current.contains(event.target as Node)) {
        setShowYoutubeInput(false);
      }
      if (linkModalRef.current && !linkModalRef.current.contains(event.target as Node)) {
        setShowLinkInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border-2 border-gray-200 shadow-sm max-w-full h-auto',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-lg',
        },
        inline: false,
        width: 640,
        height: 480,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] p-6 focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  // 🔥 SOLO ESTO CAMBIÉ: Función para detener propagación
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Subir imagen desde dispositivo - FUNCION ORIGINAL
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    
    // Insertar imagen en el editor - MÉTODO ORIGINAL QUE SÍ FUNCIONA
    editor?.chain().focus().setImage({ src: objectUrl }).run();
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setShowImageInput(false);
  };

  // Insertar imagen desde URL - FUNCION ORIGINAL
  const addImageFromUrl = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  // Insertar video de YouTube - FUNCION ORIGINAL
  const addYouTubeVideo = () => {
    if (youtubeUrl && editor) {
      let videoId = '';
      
      if (youtubeUrl.includes('youtube.com/watch?v=')) {
        videoId = youtubeUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (youtubeUrl.includes('youtu.be/')) {
        videoId = youtubeUrl.split('youtu.be/')[1] || '';
      }
      
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ 
          src: `https://www.youtube.com/embed/${videoId}` 
        }).run();
        setYoutubeUrl('');
        setShowYoutubeInput(false);
      } else {
        alert('URL de YouTube no válida');
      }
    }
  };

  // Insertar enlace - FUNCION ORIGINAL
  const addLink = () => {
    if (linkUrl && editor) {
      const previousUrl = editor.getAttributes('link').href;
      const url = linkUrl.trim();

      if (previousUrl === url) {
        setLinkUrl('');
        setShowLinkInput(false);
        return;
      }

      if (url) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setLinkUrl('');
        setShowLinkInput(false);
      }
    }
  };

  // Quitar enlace - FUNCION ORIGINAL
  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  // Insertar tabla - FUNCION ORIGINAL
  const addTable = () => {
    const rows = parseInt(prompt('Número de filas:', '3') || '3');
    const cols = parseInt(prompt('Número de columnas:', '3') || '3');
    
    if (rows > 0 && cols > 0 && rows <= 10 && cols <= 10) {
      let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #d1d5db; background: white;">';
      
      tableHtml += '<thead><tr>';
      for (let i = 0; i < cols; i++) {
        tableHtml += `<th style="border: 1px solid #d1d5db; padding: 12px; background: #f8fafc; font-weight: 600; text-align: left;">Encabezado ${i + 1}</th>`;
      }
      tableHtml += '</tr></thead>';
      
      tableHtml += '<tbody>';
      for (let i = 0; i < rows; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHtml += `<td style="border: 1px solid #d1d5db; padding: 12px;">Celda ${i + 1}-${j + 1}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table>';
      
      editor?.chain().focus().insertContent(tableHtml).run();
    }
  };

  if (!isMounted) {
    return (
      <div className="border-2 border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border-2 border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Inicializando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={editorContainerRef}
      className="border-2 border-gray-300 rounded-lg bg-white"
      onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
    >
      {/* Toolbar */}
      <div 
        className="border-b border-gray-200 p-4 bg-gray-50"
        onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
      >
        <div className="flex flex-wrap gap-2">
          
          {/* Texto y formato */}
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleBold().run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Negrita"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleItalic().run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Cursiva"
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>

          {/* Encabezados */}
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Título 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Título 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Título 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Listas */}
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleBulletList().run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Lista con viñetas"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleOrderedList().run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Cita */}
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().toggleBlockquote().run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
              }`}
              title="Cita"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Multimedia - TODO ORIGINAL */}
          <div className="flex gap-1 border-r border-gray-300 pr-3">
            {/* Imagen */}
            <div className="relative">
              <button
                onClick={(e) => {
                  stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                  setShowImageInput(!showImageInput);
                  setShowYoutubeInput(false);
                  setShowLinkInput(false);
                }}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Insertar imagen"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              
              {showImageInput && (
                <div 
                  ref={imageModalRef}
                  className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-80"
                  onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">Insertar imagen</h4>
                    <button
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        setShowImageInput(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Upload desde dispositivo - ORIGINAL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subir desde tu dispositivo
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        fileInputRef.current?.click();
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload} // FUNCIÓN ORIGINAL
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Haz clic para subir imagen</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP, GIF (Máx. 5MB)</p>
                    </div>
                  </div>
                  
                  {/* Desde URL - ORIGINAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O desde URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                      />
                      <button
                        onClick={(e) => {
                          stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                          addImageFromUrl();
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Insertar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* YouTube - ORIGINAL */}
            <div className="relative">
              <button
                onClick={(e) => {
                  stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                  setShowYoutubeInput(!showYoutubeInput);
                  setShowImageInput(false);
                  setShowLinkInput(false);
                }}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Insertar video de YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </button>
              
              {showYoutubeInput && (
                <div 
                  ref={youtubeModalRef}
                  className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-80"
                  onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">Insertar video de YouTube</h4>
                    <button
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        setShowYoutubeInput(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL del video de YouTube
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=ABCDEFG1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                      />
                    </div>
                    
                    <button
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        addYouTubeVideo();
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Insertar Video
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enlace - ORIGINAL */}
            <div className="relative">
              <button
                onClick={(e) => {
                  stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                  setShowLinkInput(!showLinkInput);
                  setShowImageInput(false);
                  setShowYoutubeInput(false);
                }}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
                title="Insertar enlace"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              
              {showLinkInput && (
                <div 
                  ref={linkModalRef}
                  className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-64"
                  onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                >
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://ejemplo.com"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
                    />
                    <button
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        addLink();
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      OK
                    </button>
                  </div>
                  {editor.isActive('link') && (
                    <button
                      onClick={(e) => {
                        stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                        removeLink();
                      }}
                      className="w-full px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 mb-2"
                    >
                      Quitar Enlace
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tabla - ORIGINAL */}
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                addTable();
              }}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="Insertar tabla"
              type="button"
            >
              <span className="text-sm font-bold">📊</span>
            </button>
          </div>

          {/* Deshacer/Rehacer - ORIGINAL */}
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().undo().run();
              }}
              disabled={!editor.can().undo()}
              className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Deshacer"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                stopPropagation(e); // 🔥 SOLO ESTO AGREGÉ
                editor.chain().focus().redo().run();
              }}
              disabled={!editor.can().redo()}
              className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Rehacer"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Área de edición - ORIGINAL */}
      <div 
        onClick={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
        onMouseDown={stopPropagation} // 🔥 SOLO ESTO AGREGÉ
      >
        <EditorContent 
          editor={editor} 
          className="min-h-[400px] prose max-w-none"
        />
      </div>
    </div>
  );
}