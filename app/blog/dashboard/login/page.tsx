// app/blog/dashboard/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Lock, User } from 'lucide-react';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Si ya está autenticado, redirigir al dashboard
    const isAuthenticated = localStorage.getItem('blog-auth') === 'true';
    if (isAuthenticated) {
      router.push('/blog/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular verificación de credenciales
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('blog-auth', 'true');
      router.push('/blog/dashboard');
    } else {
      setError('Credenciales incorrectas. Usuario: admin, Contraseña: admin123');
    }
    
    setIsLoading(false);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9CA98C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#434343] font-sans">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] to-[#F4F1EA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#9CA98C]/20">
          <div className="bg-gradient-to-r from-[#434343] to-[#666666] p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              <BookOpen className="w-8 h-8 text-[#434343]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white font-serif">
              Panel Administrativo
            </h1>
            <p className="text-white/80 text-sm mt-2">
              Instituto Pompilio Ortega
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA98C]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans"
                  placeholder="Ingresa tu usuario"
                  required
                  style={{ 
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA98C]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#9CA98C]/30 rounded-lg focus:border-[#9CA98C] focus:ring-2 focus:ring-[#9CA98C]/20 outline-none transition-all duration-300 font-sans"
                  placeholder="Ingresa tu contraseña"
                  required
                  style={{ 
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                  }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#434343] to-[#666666] text-white py-4 font-bold hover:from-[#9CA98C] hover:to-[#7D8A6E] transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              style={{ 
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>

            <div className="text-center p-4 bg-[#F4F1EA] rounded-lg border border-[#9CA98C]/20">
              <p className="text-sm text-[#434343]/70 font-sans">
                <strong>Credenciales de demo:</strong><br />
                Usuario: <span className="text-[#9CA98C] font-bold">admin</span><br />
                Contraseña: <span className="text-[#9CA98C] font-bold">admin123</span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}