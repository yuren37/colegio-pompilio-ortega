// components/blog/CardsGrid.tsx - VERSIÓN CORREGIDA
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CardsGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function CardsGrid({ 
  children, 
  className = '',
  columns = 3
}: CardsGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-50px',
    amount: 0.1
  });

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Variantes corregidas sin problemas de tipo
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  };

  // Configuración de transición separada
  const itemTransition = {
    duration: 0.6,
    ease: "easeOut" as const,
  };

  return (
    <motion.div
      ref={ref}
      className={`grid ${gridCols[columns]} gap-8 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {Array.isArray(children) ? children.map((child, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants}
          transition={itemTransition}
        >
          {child}
        </motion.div>
      )) : (
        <motion.div 
          variants={itemVariants}
          transition={itemTransition}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}