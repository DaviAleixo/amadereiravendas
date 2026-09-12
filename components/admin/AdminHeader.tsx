'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ExternalLink, Radio } from 'lucide-react';
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
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#ded7cb] px-4 lg:px-8 py-3.5 shadow-[0_1px_4px_rgba(27,16,10,0.03)]">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#17100b] tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs lg:text-sm text-[#736557] mt-0.5 font-medium">{subtitle}</p>}
        </div>

        {/* Right Actions Header */}
        <div className="flex items-center gap-3">
          {/* Live Status Pill */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admin/live"
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-black border transition-all uppercase tracking-wider ${
                liveModeActive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 text-white shadow-md shadow-rose-500/30 animate-pulse'
                  : 'bg-[#f7f3eb] border-[#ded6c7] text-[#594a3d] hover:bg-[#ede3d3]'
              }`}
            >
              <span className={`w-2 h-2 rounded-none ${liveModeActive ? 'bg-white' : 'bg-[#9c8977]'}`} />
              <Radio className="w-3.5 h-3.5" />
              <span>Modo Live: {liveModeActive ? 'AO VIVO' : 'Desativado'}</span>
            </Link>
          </motion.div>

          {/* External Site Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#5c3a21] bg-[#fcf6eb] hover:bg-[#f5ebd6] border border-[#d9c5a7] px-3.5 py-2 rounded-none transition-all shadow-sm uppercase tracking-wider"
            >
              <span>Ver Site Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
