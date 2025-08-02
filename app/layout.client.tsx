"use client";

import { ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {children}
    </div>
  );
}
