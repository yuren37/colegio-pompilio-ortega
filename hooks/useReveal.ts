// hooks/useReveal.ts
'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useReveal(staggerDelay = 80) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-50px',
    amount: 0.1
  });

  const staggerStyle = (index: number) => ({
    transitionDelay: isInView ? `${index * staggerDelay}ms` : '0ms',
  });

  return {
    ref,
    isInView,
    staggerStyle,
  };
}