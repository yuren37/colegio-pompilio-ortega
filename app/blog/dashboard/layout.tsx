// app/blog/dashboard/layout.tsx
'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}