'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  CheckCircle2,
  XCircle,
  Layers,
  Radio,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Award
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
          <div className="w-8 h-8 border-4 border-[#8c5c32] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#736557] font-medium">Carregando métricas do catálogo...</p>
        </div>
      </div>
    );
  }

  const activeProductsCount = products.filter(p => p.active).length;
  const inactiveProductsCount = products.filter(p => !p.active).length;
  const isLive = settings?.liveMode || false;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Clean Luxury Quick Actions Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e7e0d5] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c5b2b]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8c5b2b]">Painel Principal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c1511]">Ações Rápidas</h2>
          </div>
        </div>

        {/* Action Buttons Grid (Equal alignment on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/produtos/novo"
            className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#8c5b2b]/20 transition-all active:scale-95 border border-[#c8a97e]/40 text-center"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Novo Produto</span>
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-[#fdfbf7] hover:bg-[#f6ebd7] text-[#3b2d23] font-bold text-xs rounded-2xl border border-[#e7e0d5] transition-all shadow-sm active:scale-95 text-center"
          >
            <Plus className="w-4 h-4 text-[#8c5b2b] shrink-0" />
            <span>Nova Categoria</span>
          </Link>
          <Link
            href="/admin/live"
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 font-bold text-xs rounded-2xl border transition-all shadow-sm active:scale-95 text-center ${
              isLive
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-700'
                : 'bg-[#fdfbf7] hover:bg-[#f6ebd7] border-[#e7e0d5] text-[#3b2d23]'
            }`}
          >
            <Radio className={`w-4 h-4 shrink-0 ${isLive ? 'animate-pulse text-rose-600' : 'text-[#8c5b2b]'}`} />
            <span>Configurar Live</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Produtos */}
        <div className="admin-card-luxury p-5 admin-card-luxury-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Total Peças</span>
            <div className="p-2.5 bg-[#fcf6eb] text-[#8c5b2b] rounded-xl border border-[#ebdcc9]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1c1511] mt-2">{products.length}</p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">Cadastradas hoje</p>
        </div>

        {/* Card 2: Produtos Ativos */}
        <div className="admin-card-luxury p-5 admin-card-luxury-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Ativas</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{activeProductsCount}</p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">No site público</p>
        </div>

        {/* Card 3: Produtos Inativos */}
        <div className="admin-card-luxury p-5 admin-card-luxury-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Inativas</span>
            <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl border border-stone-200">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-600 mt-2">{inactiveProductsCount}</p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">Ocultas</p>
        </div>

        {/* Card 4: Categorias */}
        <div className="admin-card-luxury p-5 admin-card-luxury-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Categorias</span>
            <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1c1511] mt-2">{categories.length}</p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">Seções ativas</p>
        </div>

        {/* Card 5: Modo Live */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-all ${
          isLive ? 'bg-rose-50/80 border-rose-300' : 'admin-card-luxury'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Modo Live</span>
            <div className={`p-2.5 rounded-xl ${isLive ? 'bg-rose-600 text-white shadow-md' : 'bg-stone-100 text-stone-600'}`}>
              <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <p className={`text-xl font-extrabold mt-2 ${isLive ? 'text-rose-700' : 'text-stone-700'}`}>
            {isLive ? 'ATIVADO' : 'Desativado'}
          </p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">{isLive ? 'Ofertas Live ON' : 'Preços normais'}</p>
        </div>

        {/* Card 6: Usuários */}
        <div className="admin-card-luxury p-5 admin-card-luxury-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#736557]">Usuários</span>
            <div className="p-2.5 bg-purple-50 text-purple-800 rounded-xl border border-purple-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1c1511] mt-2">{userCount}</p>
          <p className="text-[11px] text-[#8c7d6e] mt-1 font-medium">Acessos admin</p>
        </div>
      </div>

      {/* Catalog Summary Table & Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#e7e0d5] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f2ece3] pb-4">
            <div>
              <h3 className="font-extrabold text-[#1c1511] text-base">Peças do Catálogo</h3>
              <p className="text-xs text-[#736557]">Resumo dos itens e valores de tabela</p>
            </div>
            <Link
              href="/admin/produtos"
              className="text-xs font-bold text-[#8c5b2b] hover:text-[#5c3a21] flex items-center gap-1.5 transition-colors"
            >
              Ver todas as {products.length} peças <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#f5efe6]">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-[#e0d6c8] overflow-hidden shrink-0 relative shadow-sm">
                    <img
                      src={product.images[0] || '/capa.webp'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1c1511] text-sm truncate group-hover:text-[#8c5b2b] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#736557] mt-0.5">
                      <span className="bg-[#fcf6eb] text-[#8c5b2b] px-2.5 py-0.5 rounded-md font-semibold text-[11px] border border-[#ebdcc9]">
                        {product.categoryLabel}
                      </span>
                      <span>• {product.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-extrabold text-[#1c1511] text-sm">
                    {formatCurrency(product.normalPrice.price)}
                  </p>
                  <p className="text-[11px] text-[#736557] font-medium">{product.normalPrice.installments}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Distribution Side Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#e7e0d5] shadow-sm space-y-4 flex flex-col">
          <div className="border-b border-[#f2ece3] pb-4">
            <h3 className="font-extrabold text-[#1c1511] text-base">Peças por Categoria</h3>
            <p className="text-xs text-[#736557]">Distribuição do acervo da Amadeireira</p>
          </div>

          <div className="space-y-3.5 flex-1">
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              const percentage = products.length > 0 ? Math.round((count / products.length) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#3b2d23]">{cat.name}</span>
                    <span className="text-[#736557] font-mono text-[11px]">{count} peças ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#f4eee6] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8c5b2b] to-[#b38356] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#f2ece3] text-center">
            <Link
              href="/admin/categorias"
              className="text-xs font-bold text-[#8c5b2b] hover:text-[#5c3a21] inline-flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" /> Gerenciar Categorias e Ordem
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
