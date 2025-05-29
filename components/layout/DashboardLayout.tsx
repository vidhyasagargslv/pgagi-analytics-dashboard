'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}