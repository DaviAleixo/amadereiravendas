'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/admin/ToastContainer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MobileBottomNav } from '@/components/admin/MobileBottomNav';
import { settingsService } from '@/services/settingsService';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveModeActive, setLiveModeActive] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    settingsService.getSettings().then(s => setLiveModeActive(s.liveMode));
  }, [pathname]);

  if (isLoginPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#120b07] font-sans text-stone-100 flex items-center justify-center p-4">
          {children}
        </div>
      </ToastProvider>
    );
  }

  let pageTitle = 'Dashboard';
  let pageSubtitle = 'Visão geral e métricas do catálogo';

  if (pathname.startsWith('/admin/produtos/novo')) {
    pageTitle = 'Novo Produto';
    pageSubtitle = 'Cadastrar nova peça no catálogo';
  } else if (pathname.startsWith('/admin/produtos') && pathname.includes('/editar')) {
    pageTitle = 'Editar Produto';
    pageSubtitle = 'Atualizar informações, preços e fotos da peça';
  } else if (pathname.startsWith('/admin/produtos')) {
    pageTitle = 'Gerenciar Produtos';
    pageSubtitle = 'Catálogo de peças, preços normais e promocionais';
  } else if (pathname.startsWith('/admin/categorias')) {
    pageTitle = 'Categorias';
    pageSubtitle = 'Organização e ordem das categorias do catálogo';
  } else if (pathname.startsWith('/admin/live')) {
    pageTitle = 'Catálogo / Live';
    pageSubtitle = 'Modo promocional e banner da transmissão ao vivo';
  } else if (pathname.startsWith('/admin/usuarios')) {
    pageTitle = 'Usuários do Painel';
    pageSubtitle = 'Gerenciamento de acessos (Administradores e Editores)';
  } else if (pathname.startsWith('/admin/configuracoes')) {
    pageTitle = 'Configurações';
    pageSubtitle = 'Preferências gerais e informações de contato';
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f7f4ee] font-sans text-[#1a1410] flex antialiased selection:bg-[#c8a97e]/30">
        {/* Sidebar Desktop & Mobile Drawer */}
        <AdminSidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          liveModeActive={liveModeActive}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            liveModeActive={liveModeActive}
          />

          <main className="flex-1 p-3 sm:p-5 lg:p-8 pb-24 lg:pb-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          {/* Native Mobile Bottom Navigation Bar */}
          <MobileBottomNav
            onOpenMenu={() => setMobileMenuOpen(true)}
            liveModeActive={liveModeActive}
          />
        </div>
      </div>
    </ToastProvider>
  );
}
