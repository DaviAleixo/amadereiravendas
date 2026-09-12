'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Radio,
  Users,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { authService } from '@/services/userService';
import { AdminTabId } from '@/data/mockAdminData';
import { useToast } from './ToastContainer';

type AdminSidebarProps = {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  liveModeActive?: boolean;
}

export function AdminSidebar({ isOpenMobile, onCloseMobile, liveModeActive = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    showToast('Sessão encerrada', 'Você saiu do painel administrativo.', 'info');
    router.push('/admin/login');
  };

  const allNavItems: { id: AdminTabId; label: string; href: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'produtos', label: 'Produtos', href: '/admin/produtos', icon: Package },
    { id: 'categorias', label: 'Categorias', href: '/admin/categorias', icon: Layers },
    {
      id: 'live',
      label: 'Catálogo / Live',
      href: '/admin/live',
      icon: Radio,
      badge: liveModeActive ? 'AO VIVO' : undefined,
      badgeColor: liveModeActive ? 'bg-rose-700 text-white shadow-sm' : undefined
    },
    { id: 'usuarios', label: 'Usuários', href: '/admin/usuarios', icon: Users },
    { id: 'configuracoes', label: 'Configurações', href: '/admin/configuracoes', icon: Settings }
  ];

  const allowedTabs = currentUser?.allowedTabs || ['dashboard', 'produtos', 'categorias', 'live', 'usuarios', 'configuracoes'];
  const navItems = currentUser?.role === 'ADMINISTRADOR'
    ? allNavItems
    : allNavItems.filter(item => allowedTabs.includes(item.id));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0e0805] text-[#e6dcce] border-r border-[#26180f]">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#22150d]">
        <Link href="/admin/dashboard" className="flex items-center gap-3.5 group" onClick={onCloseMobile}>
          <div className="w-10 h-10 rounded-none bg-[#1a0f08] border border-[#c8a97e]/40 flex items-center justify-center p-1.5 group-hover:border-[#c8a97e] transition-colors shadow-inner">
            <img src="/logo1.webp" alt="Amadeireira Logo" className="w-full h-auto object-contain rounded-none" />
          </div>
          <div>
            <h1 className="font-extrabold text-white tracking-tight text-base group-hover:text-[#c8a97e] transition-colors">
              Amadeireira
            </h1>
            <p className="text-[10px] text-[#c8a97e] uppercase font-bold tracking-widest">Painel de Gestão</p>
          </div>
        </Link>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-stone-400 hover:text-white p-2 rounded-none hover:bg-[#23160e] transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase tracking-widest text-[#8c7a67] font-extrabold mb-3">Navegação Principal</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <motion.div key={item.href} whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }}>
              <Link
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-3 rounded-none font-medium text-sm transition-all relative group ${
                  isActive
                    ? 'bg-[#1f130b] text-[#fcefdc] border border-[#c8a97e]/40 shadow-sm font-bold'
                    : 'text-[#9c8b79] hover:text-white hover:bg-[#160d07] border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#c8a97e]" />
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-[#c8a97e]' : 'text-[#7a6a59] group-hover:text-stone-300'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-none tracking-wider uppercase border border-rose-500/50 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#c8a97e] translate-x-0.5' : 'text-[#47392d] opacity-0 group-hover:opacity-100'}`} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#22150d] bg-[#090503]">
        {currentUser && (
          <div className="flex items-center justify-between bg-[#140c07] p-3 rounded-none border border-[#2d1b10]">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {currentUser.role === 'ADMINISTRADOR' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#c8a97e] font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                    <UserCheck className="w-3 h-3" /> Editor
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sair do painel"
              className="text-[#968676] hover:text-rose-400 p-2 rounded-none hover:bg-[#23150c] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay with Motion */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#090604]/80 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-72 max-w-full h-full z-10 shadow-2xl border-l border-[#2d1b10]"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
