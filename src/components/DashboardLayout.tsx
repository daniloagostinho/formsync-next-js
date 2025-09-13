'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <Topbar onToggleMobileMenu={toggleMobileMenu} />
      
      {/* Layout Principal */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

        {/* Conteúdo Principal */}
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
