'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Radio, Menu } from 'lucide-react';
import { authService } from '@/services/userService';
import { AdminTabId } from '@/data/mockAdminData';

type MobileBottomNavProps = {
  onOpenMenu: () => void;
  liveModeActive?: boolean;
}

export function MobileBottomNav({ onOpenMenu, liveModeActive = false }: MobileBottomNavProps) {
  const pathname = usePathname();
  const currentUser = authService.getCurrentUser();
  const allowedTabs = currentUser?.allowedTabs || ['dashboard', 'produtos', 'categorias', 'live', 'usuarios', 'configuracoes'];

  const allNavItems: { id: AdminTabId; label: string; href: string; icon: any; badge?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'produtos', label: 'Produtos', href: '/admin/produtos', icon: Package },
    { id: 'categorias', label: 'Categorias', href: '/admin/categorias', icon: Layers },
    {
      id: 'live',
      label: 'Live',
      href: '/admin/live',
      icon: Radio,
      badge: liveModeActive
    }
  ];

  const navItems = currentUser?.role === 'ADMINISTRADOR'
    ? allNavItems
    : allNavItems.filter(item => allowedTabs.includes(item.id));

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0e0805]/98 backdrop-blur-md border-t border-[#26180f] px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-none transition-all relative ${
                isActive
                  ? 'text-white font-bold bg-[#1f130b] border border-[#c8a97e]/40'
                  : 'text-[#9c8b79] hover:text-white font-medium border border-transparent'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#c8a97e]' : 'text-[#857463]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-none animate-ping" />
                )}
              </div>
              <span className="text-[10px] tracking-tight text-white font-semibold">{item.label}</span>
            </Link>
          );
        })}

        {/* Menu Drawer Button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-none text-[#9c8b79] hover:text-white font-medium border border-transparent hover:bg-[#1f130b]"
        >
          <Menu className="w-5 h-5 text-[#857463]" />
          <span className="text-[10px] tracking-tight text-white font-semibold">Mais</span>
        </button>
      </div>
    </div>
  );
}
