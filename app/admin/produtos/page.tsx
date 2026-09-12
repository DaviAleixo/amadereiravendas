'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Radio,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown
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
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="modal rounded-none border border-[#ded6c7]"
      >
        <button className="modal-close rounded-none" aria-label="Fechar detalhes" onClick={onClose}>
          <X size={18} />
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
            <div className="absolute top-4 left-4 bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-none shadow-lg z-10 flex items-center gap-1.5 animate-pulse">
              <Radio size={13} /> Oferta Live Ativa
            </div>
          )}
          <div className="modal-controls">
            {product.images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Imagem anterior" className="rounded-none">
                  <ChevronLeft size={18} />
                </button>
                <span className="font-mono text-xs">
                  {index + 1} / {product.images.length}
                </span>
                <button onClick={next} aria-label="Próxima imagem" className="rounded-none">
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
              className="button button-whatsapp !m-0 flex-1 rounded-none"
              href={productWhatsappUrl(product as any)}
              target="_blank"
              rel="noreferrer"
            >
              <img src="/wpp.png" alt="WhatsApp" style={{ width: '17px', height: '17px' }} /> Tenho interesse
            </a>
            <Link
              href={`/admin/produtos/${product.id}/editar`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
            >
              <Edit2 size={14} /> Editar Peça
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats, settings] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        settingsService.getSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setLiveMode(settings.liveMode);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (statusFilter === 'active' && !p.active) return false;
      if (statusFilter === 'inactive' && p.active) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesWood = p.wood.toLowerCase().includes(query);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(query);
        const matchesDim = p.dimensions.toLowerCase().includes(query);
        if (!matchesName && !matchesWood && !matchesCategory && !matchesDim) return false;
      }
      return true;
    });
  }, [products, selectedCategory, statusFilter, searchQuery]);

  const handleToggleActive = async (id: number) => {
    const updated = await productService.toggleActive(id);
    if (updated) {
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      showToast(
        updated.active ? 'Produto Ativado' : 'Produto Ocultado',
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
          <div className="w-8 h-8 border-2 border-[#8c5b2b] border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-[#736557] font-semibold uppercase tracking-wider">Carregando catálogo de produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#ded6c7] shadow-sm">
        <div>
          <h2 className="text-lg font-black text-[#17100b] tracking-tight">Catálogo de Produtos ({products.length})</h2>
          <p className="text-xs text-[#736557]">Gerencie preços normais, promocionais da Live, dimensões e fotos.</p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm transition-all shrink-0 border border-[#c8a97e]/40 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Novo Produto
          </Link>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-none border border-[#ded6c7] shadow-sm space-y-3">
        {/* Search Row */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8c5b2b] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por peça, madeira, medida..."
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-semibold text-[#17100b] placeholder:text-[#9e8f7e]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#9e8f7e] hover:text-[#17100b] p-0.5 rounded-none hover:bg-stone-200 transition-colors"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Row: 2-column grid on mobile for perfect alignment */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-bold text-[#3b2d23] bg-[#fcfaf7] border border-[#ded6c7] rounded-none hover:border-[#c8a97e] focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none transition-all shadow-sm cursor-pointer truncate uppercase tracking-wider"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c5b2b] absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-bold text-[#3b2d23] bg-[#fcfaf7] border border-[#ded6c7] rounded-none hover:border-[#c8a97e] focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none transition-all shadow-sm cursor-pointer truncate uppercase tracking-wider"
            >
              <option value="all">Todos os Status</option>
              <option value="active">🟢 Apenas Ativos</option>
              <option value="inactive">🔴 Apenas Ocultos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c5b2b] absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Active Filter Clear */}
          {(selectedCategory !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="col-span-2 sm:col-span-1 text-[11px] font-bold text-[#8c5b2b] hover:text-[#5a3818] underline py-1 px-2 text-center"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Desktop Products Table */}
      <div className="hidden md:block bg-white rounded-none border border-[#ece4d8] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf7] border-b border-[#ece4d8] text-[10px] font-extrabold text-[#736557] uppercase tracking-wider">
              <th className="py-4 px-6">Produto</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Dimensões / Madeira</th>
              <th className="py-4 px-4">Preço Normal</th>
              <th className="py-4 px-4">Preço Live</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-500">
                  <Package className="w-8 h-8 text-[#a89988] mx-auto mb-2" />
                  <p className="font-bold text-[#17100b]">Nenhum produto encontrado</p>
                  <p className="text-xs text-[#736557] mt-1">Tente ajustar os termos de busca ou filtros.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className={`transition-colors group ${
                    idx % 2 === 0 ? 'bg-white hover:bg-[#f5ebd6]/50' : 'bg-[#f8f4ee] hover:bg-[#f0e3cc]/60'
                  }`}
                >
                  {/* Photo & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewProduct(product)}>
                      <div className="w-12 h-12 rounded-none bg-stone-100 overflow-hidden shrink-0 relative shadow-sm">
                        <img
                          src={product.images[0] || '/capa.webp'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#17100b] group-hover:text-[#8c5b2b] transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#8c7a67] font-mono">id: #{product.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="inline-block bg-[#fcf6eb] text-[#8c5b2b] text-[11px] font-bold px-2.5 py-1 rounded-none uppercase tracking-wider">
                      {product.categoryLabel}
                    </span>
                  </td>

                  {/* Dimensions & Wood */}
                  <td className="py-4 px-4">
                    <p className="text-xs font-bold text-[#17100b]">{product.dimensions}</p>
                    <p className="text-[11px] text-[#736557]">{product.wood}</p>
                  </td>

                  {/* Normal Price */}
                  <td className="py-4 px-4">
                    <p className="font-black text-[#17100b] text-sm">
                      {formatCurrency(product.normalPrice.price)}
                    </p>
                    <p className="text-[11px] text-[#736557] truncate max-w-[150px]">
                      {product.normalPrice.installments}
                    </p>
                  </td>

                  {/* Live Price */}
                  <td className="py-4 px-4">
                    {product.livePrice && product.livePrice.price > 0 ? (
                      <div>
                        <p className="font-black text-rose-700 text-sm flex items-center gap-1">
                          <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
                          {formatCurrency(product.livePrice.price)}
                        </p>
                        <p className="text-[11px] text-rose-900/70 truncate max-w-[150px]">
                          {product.livePrice.installments}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-[#8c7a67] italic font-medium">Mesmo do normal</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-bold transition-colors ${
                        product.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
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
                        className="p-2 text-[#8c5b2b] bg-[#fcf6eb] hover:bg-[#f5ebd6] rounded-none transition-colors"
                        title="Ver modal da peça no site"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/produtos/${product.id}/editar`}
                        className="p-2 text-[#5c4a3b] hover:text-[#17100b] hover:bg-[#fcfaf7] rounded-none transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-none transition-colors"
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
      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-none p-8 text-center border border-[#ece4d8] text-stone-500">
            <Package className="w-8 h-8 text-[#a89988] mx-auto mb-2" />
            <p className="font-bold text-[#17100b]">Nenhum produto encontrado</p>
          </div>
        ) : (
          filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`rounded-none p-4 border border-[#ece4d8] shadow-sm space-y-3 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f4ee]'
              }`}
            >
              <div className="flex items-start gap-3" onClick={() => setViewProduct(product)}>
                <div className="w-16 h-16 rounded-none bg-stone-100 overflow-hidden shrink-0">
                  <img src={product.images[0] || '/capa.webp'} alt={product.name} className="w-full h-full object-cover rounded-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2 py-0.5 rounded-none uppercase tracking-wider">
                      {product.categoryLabel}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleActive(product.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${
                        product.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <h4 className="font-bold text-[#17100b] text-sm mt-1 truncate">{product.name}</h4>
                  <p className="text-xs text-[#736557]">{product.dimensions} • {product.wood}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f2ece3]/80 text-xs">
                <div>
                  <span className="text-[9px] font-extrabold text-[#8c7a67] block uppercase tracking-wider">Preço Normal</span>
                  <strong className="text-[#17100b] text-sm font-black">{formatCurrency(product.normalPrice.price)}</strong>
                </div>

                {product.livePrice && product.livePrice.price > 0 && (
                  <div className="text-right">
                    <span className="text-[9px] font-extrabold text-rose-700 block uppercase tracking-wider">Preço Live</span>
                    <strong className="text-rose-700 text-sm font-black">{formatCurrency(product.livePrice.price)}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f2ece3]/80">
                <button
                  onClick={() => setViewProduct(product)}
                  className="px-3 py-1.5 text-xs font-bold text-[#8c5b2b] bg-[#fcf6eb] rounded-none flex items-center gap-1 uppercase tracking-wider"
                >
                  <Eye size={13} /> Visualizar
                </button>
                <Link
                  href={`/admin/produtos/${product.id}/editar`}
                  className="px-3 py-1.5 text-xs font-bold text-[#5c4a3b] bg-[#fcfaf7] rounded-none flex items-center gap-1 uppercase tracking-wider"
                >
                  <Edit2 size={13} /> Editar
                </Link>
                <button
                  onClick={() => setDeleteId(product.id)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-none uppercase tracking-wider"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Site Modal (Opens when clicking Eye icon) */}
      <AnimatePresence>
        {viewProduct && (
          <ProductSiteModal
            product={viewProduct}
            onClose={() => setViewProduct(null)}
            liveMode={liveMode}
          />
        )}
      </AnimatePresence>

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
    </motion.div>
  );
}
