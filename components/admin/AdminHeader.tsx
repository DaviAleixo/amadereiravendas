'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, Radio } from 'lucide-react';
import { authService } from '@/services/userService';

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  liveModeActive?: boolean;
}

export function AdminHeader({ title, subtitle, liveModeActive = false }: AdminHeaderProps) {
  const currentUser = authService.getCurrentUser();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#e8e2d8] px-4 lg:px-8 py-4 shadow-[0_2px_12px_rgba(27,16,10,0.03)]">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#1c1511] tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs lg:text-sm text-[#736557] mt-0.5 font-medium">{subtitle}</p>}
        </div>

        {/* Right Actions Header */}
        <div className="flex items-center gap-3">
          {/* Live Status Pill */}
          <Link
            href="/admin/live"
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              liveModeActive
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm hover:bg-rose-100'
                : 'bg-[#f7f2ea] border-[#e4d9c9] text-[#615244] hover:bg-[#efe6d8]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${liveModeActive ? 'bg-rose-600 animate-ping' : 'bg-[#9c8977]'}`} />
            <Radio className="w-3.5 h-3.5" />
            <span>Modo Live: {liveModeActive ? 'ATIVADO' : 'Desativado'}</span>
          </Link>

          {/* External Site Button */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-[#5c3a21] bg-[#fcf6eb] hover:bg-[#f6ebd7] border border-[#e5d2b7] px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
