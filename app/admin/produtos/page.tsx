'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  Radio,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { settingsService } from '@/services/settingsService';
import { Product, Category } from '@/data/mockAdminData';
import { formatCurrency } from '@/lib/currency';
import { productWhatsappUrl } from '@/lib/whatsapp';
import { useToast } from '@/components/admin/ToastContainer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

function ProductSiteModal({
  product,
  onClose,
  liveMode
}: {
  product: Product;
  onClose: () => void;
  liveMode: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', key);
    };
  }, [onClose]);

  const next = () => setIndex(i => (i + 1) % product.images.length);
  const prev = () => setIndex(i => (i - 1 + product.images.length) % product.images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) next();
    if (distance < -50) prev();
  };

  const activePrice =
    liveMode && product.livePrice && product.livePrice.price > 0
      ? product.livePrice
      : product.normalPrice;

  const isLiveOffer = liveMode && product.livePrice && product.livePrice.price > 0;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="modal-close" aria-label="Fechar detalhes" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Gallery Section */}
        <div
          className="modal-gallery"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={product.images[index] || '/capa.webp'}
            alt={`${product.name}, imagem ${index + 1}`}
            fill
            sizes="(max-width: 800px) 100vw, 60vw"
            priority
          />
          {isLiveOffer && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-lg z-10 flex items-center gap-1.5 animate-pulse">
              <Radio size={13} /> Oferta Live Ativa
            </div>
          )}
          <div className="modal-controls">
            {product.images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Imagem anterior">
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {index + 1} / {product.images.length}
                </span>
                <button onClick={next} aria-label="Próxima imagem">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="modal-details">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="eyebrow !m-0">{product.categoryLabel}</p>
            <span className="text-[10px] font-mono text-stone-400">id: #{product.id}</span>
          </div>

          <h2>{product.name}</h2>
          <p className="modal-description">{product.description}</p>
          <dl>
            <div>
              <dt>Medidas</dt>
              <dd>{product.dimensions}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>{product.wood}</dd>
            </div>
          </dl>

          <div className="modal-price">
            <div className="product-prices">
              {activePrice.oldPrice && <span className="price-old">De: {activePrice.oldPrice}</span>}
              <strong className="price-installments">
                {activePrice.oldPrice ? 'Por: ' : ''}
                {activePrice.installments}
              </strong>
              <span className="price-cash">À vista: {formatCurrency(activePrice.price)}</span>
            </div>
          </div>

          {/* Action Buttons: Site Interest + Direct Admin Edit */}
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-6">
            <a
              className="button button-whatsapp !m-0 flex-1"
              href={productWhatsappUrl(product as any)}
              target="_blank"
              rel="noreferrer"
            >
              <img src="/wpp.png" alt="WhatsApp" style={{ width: '17px', height: '17px' }} /> Tenho interesse
            </a>
            <Link
              href={`/admin/produtos/${product.id}/editar`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
            >
              <Edit2 size={15} /> Editar Peça
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [prods, cats, sets] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      settingsService.getSettings()
    ]);
    setProducts(prods);
    setCategories(cats);
    setLiveMode(sets.liveMode);
    setLoading(false);
  }

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.wood.toLowerCase().includes(q) ||
        product.dimensions.toLowerCase().includes(q);

      // Category
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.active) ||
        (statusFilter === 'inactive' && !product.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  const handleToggleActive = async (id: number) => {
    const updated = await productService.toggleActive(id);
    if (updated) {
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      showToast(
        updated.active ? 'Produto Ativado' : 'Produto Desativado',
        `"${updated.name}" agora está ${updated.active ? 'visível' : 'oculto'} no catálogo.`,
        updated.active ? 'success' : 'info'
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    const target = products.find(p => p.id === deleteId);
    const success = await productService.delete(deleteId);
    setDeleteId(null);

    if (success) {
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      showToast('Produto Removido', `"${target?.name}" foi removido do catálogo.`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando catálogo de produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Catálogo de Produtos ({products.length})</h2>
          <p className="text-xs text-stone-500">Gerencie preços normais, promocionais da Live, dimensões e fotos.</p>
        </div>

        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-900/20 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3 lg:space-y-0 lg:flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome da peça, madeira, dimensão..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Somente Ativos</option>
            <option value="inactive">Somente Inativos</option>
          </select>
        </div>
      </div>

      {/* Desktop Products Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-4 px-6">Produto</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Dimensões / Madeira</th>
              <th className="py-4 px-4">Preço Normal</th>
              <th className="py-4 px-4">Preço Live</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-500">
                  <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-semibold text-stone-700">Nenhum produto encontrado</p>
                  <p className="text-xs text-stone-400 mt-1">Tente ajustar os termos de busca ou filtros.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-stone-50/60 transition-colors group">
                  {/* Photo & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewProduct(product)}>
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative">
                        <img
                          src={product.images[0] || '/capa.webp'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 group-hover:text-amber-900 transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-stone-400 font-mono">id: #{product.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="inline-block bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {product.categoryLabel}
                    </span>
                  </td>

                  {/* Dimensions & Wood */}
                  <td className="py-4 px-4">
                    <p className="text-xs font-medium text-stone-800">{product.dimensions}</p>
                    <p className="text-[11px] text-stone-500">{product.wood}</p>
                  </td>

                  {/* Normal Price */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-stone-900 text-sm">
                      {formatCurrency(product.normalPrice.price)}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate max-w-[150px]">
                      {product.normalPrice.installments}
                    </p>
                  </td>

                  {/* Live Price */}
                  <td className="py-4 px-4">
                    {product.livePrice && product.livePrice.price > 0 ? (
                      <div>
                        <p className="font-bold text-rose-700 text-sm flex items-center gap-1">
                          <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                          {formatCurrency(product.livePrice.price)}
                        </p>
                        <p className="text-[11px] text-rose-900/70 truncate max-w-[150px]">
                          {product.livePrice.installments}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">Mesmo do normal</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        product.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                      title={product.active ? 'Clique para desativar' : 'Clique para ativar'}
                    >
                      {product.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewProduct(product)}
                        className="p-2 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/80"
                        title="Ver modal da peça no site"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/produtos/${product.id}/editar`}
                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Products Cards List */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500">
            <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-semibold text-stone-700">Nenhum produto encontrado</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-start gap-3" onClick={() => setViewProduct(product)}>
                <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                  <img src={product.images[0] || '/capa.webp'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                      {product.categoryLabel}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleActive(product.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mt-1 truncate">{product.name}</h4>
                  <p className="text-xs text-stone-500">{product.dimensions} • {product.wood}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 block uppercase">Preço Normal</span>
                  <strong className="text-stone-900 text-sm">{formatCurrency(product.normalPrice.price)}</strong>
                </div>

                {product.livePrice && product.livePrice.price > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-rose-600 block uppercase">Preço Live</span>
                    <strong className="text-rose-700 text-sm">{formatCurrency(product.livePrice.price)}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setViewProduct(product)}
                  className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 rounded-lg flex items-center gap-1"
                >
                  <Eye size={13} /> Visualizar
                </button>
                <Link
                  href={`/admin/produtos/${product.id}/editar`}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 rounded-lg flex items-center gap-1"
                >
                  <Edit2 size={13} /> Editar
                </Link>
                <button
                  onClick={() => setDeleteId(product.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Site Modal (Opens when clicking Eye icon) */}
      {viewProduct && (
        <ProductSiteModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          liveMode={liveMode}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Excluir Produto?"
        description="Esta ação removerá permanentemente o produto do seu catálogo. Deseja continuar?"
        confirmText="Sim, Excluir Produto"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
