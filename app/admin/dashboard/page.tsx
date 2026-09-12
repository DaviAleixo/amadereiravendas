'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Package,
  CheckCircle2,
  XCircle,
  Layers,
  Radio,
  Users,
  Plus,
  ArrowRight,
  Sliders,
  Sparkles
} from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { settingsService } from '@/services/settingsService';
import { userService } from '@/services/userService';
import { Product, Category, CatalogSettings } from '@/data/mockAdminData';
import { formatCurrency } from '@/lib/currency';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<CatalogSettings | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prods, cats, sets, users] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        settingsService.getSettings(),
        userService.getAll()
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(sets);
      setUserCount(users.length);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#8c5b2b] border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-[#736557] font-semibold uppercase tracking-wider">Carregando métricas do catálogo...</p>
        </div>
      </div>
    );
  }

  const activeProductsCount = products.filter(p => p.active).length;
  const inactiveProductsCount = products.filter(p => !p.active).length;
  const isLive = settings?.liveMode || false;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Clean Luxury Quick Actions Header */}
      <motion.div variants={itemVariants} className="bg-white p-5 sm:p-6 rounded-none border border-[#ded6c7] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-none bg-[#8c5b2b]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c5b2b]">Painel Principal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17100b] tracking-tight">Ações Rápidas</h2>
          </div>
        </div>

        {/* Action Buttons Grid with Motion Gestures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/admin/produtos/novo"
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-[#8c5b2b] hover:bg-[#754a21] text-white font-bold text-xs rounded-none shadow-sm transition-all border border-[#c8a97e]/40 text-center uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Novo Produto</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/admin/categorias"
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-[#fcfaf7] hover:bg-[#f5ebd6] text-[#3b2d23] font-bold text-xs rounded-none border border-[#ded6c7] transition-all shadow-sm text-center uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#8c5b2b] shrink-0" />
              <span>Nova Categoria</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/admin/live"
              className={`flex items-center justify-center gap-2.5 px-4 py-3.5 font-bold text-xs rounded-none border transition-all shadow-sm text-center uppercase tracking-wider ${
                isLive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border-red-400 text-white shadow-md shadow-rose-600/30'
                  : 'bg-[#fcfaf7] hover:bg-[#f5ebd6] border-[#ded6c7] text-[#3b2d23]'
              }`}
            >
              <Radio className={`w-4 h-4 shrink-0 ${isLive ? 'text-white animate-pulse' : 'text-[#8c5b2b]'}`} />
              <span>{isLive ? '🔴 Live Ao Vivo (Gerenciar)' : 'Configurar Live'}</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Metrics Cards Grid with Motion Micro-Interactions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Produtos */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="admin-card-luxury p-4 sm:p-5 rounded-none cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736557]">Total Peças</span>
            <div className="p-2 bg-[#fcf6eb] text-[#8c5b2b] rounded-none border border-[#ded1be]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#17100b] mt-2 tracking-tight">{products.length}</p>
          <p className="text-[10px] text-[#8c7a67] mt-1 font-semibold uppercase tracking-wider">Cadastradas hoje</p>
        </motion.div>

        {/* Card 2: Produtos Ativos */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="admin-card-luxury p-4 sm:p-5 rounded-none cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736557]">Ativas</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-none border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#17100b] mt-2 tracking-tight">{activeProductsCount}</p>
          <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">No catálogo</p>
        </motion.div>

        {/* Card 3: Produtos Inativos */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="admin-card-luxury p-4 sm:p-5 rounded-none cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736557]">Inativas</span>
            <div className="p-2 bg-stone-100 text-stone-600 rounded-none border border-stone-200">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#17100b] mt-2 tracking-tight">{inactiveProductsCount}</p>
          <p className="text-[10px] text-[#8c7a67] mt-1 font-semibold uppercase tracking-wider">Ocultas</p>
        </motion.div>

        {/* Card 4: Categorias */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="admin-card-luxury p-4 sm:p-5 rounded-none cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736557]">Categorias</span>
            <div className="p-2 bg-amber-50 text-amber-900 rounded-none border border-amber-200">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#17100b] mt-2 tracking-tight">{categories.length}</p>
          <p className="text-[10px] text-[#8c7a67] mt-1 font-semibold uppercase tracking-wider">Seções ativas</p>
        </motion.div>

        {/* Card 5: Modo Live */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`p-4 sm:p-5 rounded-none border shadow-sm transition-all cursor-pointer ${
            isLive
              ? 'bg-gradient-to-br from-rose-600 to-red-600 border-red-400 text-white shadow-lg shadow-rose-500/25'
              : 'admin-card-luxury'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLive ? 'text-rose-100' : 'text-[#736557]'}`}>Modo Live</span>
            <div className={`p-2 rounded-none ${isLive ? 'bg-white text-rose-700 shadow-sm' : 'bg-stone-100 text-stone-600'}`}>
              <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <p className={`text-xl font-black mt-2 tracking-tight ${isLive ? 'text-white' : 'text-stone-700'}`}>
            {isLive ? 'AO VIVO' : 'Desativado'}
          </p>
          <p className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${isLive ? 'text-rose-100' : 'text-[#8c7a67]'}`}>
            {isLive ? 'Ofertas Live ON' : 'Preços normais'}
          </p>
        </motion.div>

        {/* Card 6: Usuários */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="admin-card-luxury p-4 sm:p-5 rounded-none cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736557]">Usuários</span>
            <div className="p-2 bg-stone-100 text-stone-700 rounded-none border border-stone-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#17100b] mt-2 tracking-tight">{userCount}</p>
          <p className="text-[10px] text-[#8c7a67] mt-1 font-semibold uppercase tracking-wider">Acessos admin</p>
        </motion.div>
      </motion.div>

      {/* Catalog Summary Table & Categories Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products List */}
        <div className="lg:col-span-2 bg-white rounded-none p-5 sm:p-6 border border-[#ece4d8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e9dd]/80 pb-4">
            <div>
              <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">Peças do Catálogo</h3>
              <p className="text-xs text-[#736557]">Resumo dos itens e valores de tabela</p>
            </div>
            <motion.div whileHover={{ x: 3 }}>
              <Link
                href="/admin/produtos"
                className="text-xs font-bold text-[#8c5b2b] hover:text-[#5c3a21] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                Ver todas as {products.length} peças <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          <div className="overflow-hidden">
            {products.slice(0, 5).map((product, idx) => (
              <motion.div 
                key={product.id} 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className={`py-3 px-3 flex items-center justify-between gap-4 group transition-colors rounded-none ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f4ee]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Perfectly square product thumbnail */}
                  <div className="w-12 h-12 rounded-none bg-stone-100 overflow-hidden shrink-0 relative shadow-sm">
                    <img
                      src={product.images[0] || '/capa.webp'}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-none"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#17100b] text-sm truncate group-hover:text-[#8c5b2b] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#736557] mt-0.5">
                      <span className="bg-[#fcf6eb] text-[#8c5b2b] px-2 py-0.5 rounded-none font-bold text-[10px] uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <span>• {product.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-[#17100b] text-sm">
                    {formatCurrency(product.normalPrice.price)}
                  </p>
                  <p className="text-[11px] text-[#736557] font-medium">{product.normalPrice.installments}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories Distribution Side Card */}
        <div className="bg-white rounded-none p-5 sm:p-6 border border-[#ded6c7] shadow-sm space-y-4 flex flex-col">
          <div className="border-b border-[#f0e9dd] pb-4">
            <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">Peças por Categoria</h3>
            <p className="text-xs text-[#736557]">Distribuição do acervo da Amadeireira</p>
          </div>

          <div className="space-y-3.5 flex-1">
            {categories.map((cat, index) => {
              const count = products.filter(p => p.category === cat.id).length;
              const percentage = products.length > 0 ? Math.round((count / products.length) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#3b2d23] font-bold">{cat.name}</span>
                    <span className="text-[#736557] font-mono text-[11px]">{count} peças ({percentage}%)</span>
                  </div>
                  {/* Square animated progress bar */}
                  <div className="w-full bg-[#f4eee6] h-2.5 rounded-none overflow-hidden border border-[#ded6c7]/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * index, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-[#8c5b2b] to-[#b38356] h-full rounded-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#f0e9dd] text-center">
            <motion.div whileHover={{ y: -1 }}>
              <Link
                href="/admin/categorias"
                className="text-xs font-bold text-[#8c5b2b] hover:text-[#5c3a21] inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <Sliders className="w-3.5 h-3.5" /> Gerenciar Categorias e Ordem
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
