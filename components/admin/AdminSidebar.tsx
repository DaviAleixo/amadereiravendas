'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
      badgeColor: liveModeActive ? 'bg-rose-600 text-white animate-pulse' : undefined
    },
    { id: 'usuarios', label: 'Usuários', href: '/admin/usuarios', icon: Users },
    { id: 'configuracoes', label: 'Configurações', href: '/admin/configuracoes', icon: Settings }
  ];

  const allowedTabs = currentUser?.allowedTabs || ['dashboard', 'produtos', 'categorias', 'live', 'usuarios', 'configuracoes'];
  const navItems = currentUser?.role === 'ADMINISTRADOR'
    ? allNavItems
    : allNavItems.filter(item => allowedTabs.includes(item.id));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#120b07] text-[#e6dcce] border-r border-[#26180f]">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#26180f]">
        <Link href="/admin/dashboard" className="flex items-center gap-3.5 group" onClick={onCloseMobile}>
          <div className="w-10 h-10 rounded-xl bg-[#2b1b11] border border-[#c8a97e]/30 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform shadow-md">
            <img src="/logo1.webp" alt="Amadeireira Logo" className="w-full h-auto object-contain" />
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
          className="lg:hidden text-stone-400 hover:text-white p-2 rounded-lg hover:bg-[#23160e] transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase tracking-widest text-[#9e8f7e] font-bold mb-3">Navegação Principal</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all relative group ${
                isActive
                  ? 'bg-[#2b1a10] text-[#fcefdc] border border-[#7a4e28]/50 shadow-md font-bold'
                  : 'text-[#a39483] hover:text-white hover:bg-[#21140b]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#c8a97e] rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#c8a97e]' : 'text-[#857463] group-hover:text-stone-300'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#c8a97e] translate-x-0.5' : 'text-[#544638] opacity-0 group-hover:opacity-100'}`} />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#26180f] bg-[#0c0704]">
        {currentUser && (
          <div className="flex items-center justify-between bg-[#1d130c] p-3 rounded-2xl border border-[#332115]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#362112] border border-[#c8a97e]/40 flex items-center justify-center text-[#f2dfc8] font-bold text-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {currentUser.role === 'ADMINISTRADOR' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#c8a97e] font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                      <UserCheck className="w-3 h-3" /> Editor
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sair do painel"
              className="text-[#968676] hover:text-rose-400 p-2 rounded-xl hover:bg-[#2d1b10] transition-colors"
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

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#090604]/80 backdrop-blur-sm animate-fadeIn"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-full h-full z-10 animate-slideLeft shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
