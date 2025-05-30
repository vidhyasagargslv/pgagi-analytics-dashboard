// src/components/layout/DashboardLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Header } from './Header'; // Assuming you have this
import { Sidebar, ActiveView } from './Sidebar'; // Import ActiveView
import { Footer } from './Footer'; // Assuming you have this

interface DashboardLayoutProps {
  children: React.ReactNode; // Children is now a ReactNode
  activeView: ActiveView;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

export function DashboardLayout({ children, activeView, setActiveView }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-300"> {/* Added bg for overall page */}
      <div className="flex flex-col md:flex-row">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col min-h-screen"> {/* Ensure content div can also be full height */}
          <Header 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <main className="p-4 sm:p-6 flex-1 overflow-y-auto bg-base-100"> {/* Main content area styling */}
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}