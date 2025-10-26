'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const paths = pathname.split('/').filter(path => path);
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-[#9CA98C]/20 py-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm">
          {/* Botón de volver al inicio */}
          <Link
            href="/"
            className="flex items-center space-x-1 text-[#434343] hover:text-[#9CA98C] transition-colors duration-300 group font-bold"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>

          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            const label = path.charAt(0).toUpperCase() + path.slice(1);

            return (
              <div key={href} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-[#9CA98C]" />
                {isLast ? (
                  <span className="text-[#9CA98C] font-bold">{label}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-[#434343] hover:text-[#9CA98C] transition-colors duration-300 font-bold"
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}