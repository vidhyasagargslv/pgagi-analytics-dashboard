'use client';

import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar, ActiveView } from './Sidebar';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: ActiveView;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

export function DashboardLayout({ children, activeView, setActiveView }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-300">
      <div className="flex flex-col md:flex-row over">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <main className="p-4 sm:p-6 flex-1 overflow-y-auto bg-base-100">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}