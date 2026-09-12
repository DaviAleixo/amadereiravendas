'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Menu, X, Search, Sparkles, Leaf, Compass, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories as defaultCategories, formatCategory } from '@/data/products';
import { formatCurrency } from '@/lib/currency';
import { generalWhatsappUrl } from '@/lib/whatsapp';
import { productService } from '@/services/productService';
import { settingsService } from '@/services/settingsService';
import { categoryService } from '@/services/categoryService';
import { Product, CatalogSettings, INITIAL_SETTINGS } from '@/data/mockAdminData';
import { AceternityTabs } from '@/components/ui/AceternityTabs';
import { AceternitySpotlightCard } from '@/components/ui/AceternitySpotlightCard';
import { ProductModalMotion } from '@/components/ui/ProductModalMotion';

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Floating Luxury Header Bar (Positioned over Hero image) */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3 sm:p-5">
        <header className="max-w-7xl mx-auto bg-[#180e09]/90 backdrop-blur-xl border border-amber-600/30 rounded-md px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 group" aria-label="Amadeireira, início">
            <img src="/logo1.webp" alt="Amadeireira" className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105" />
          </a>

          {/* Desktop Nav Links (Matching Reference Photo) */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-300">
            <a href="#produtos" className="hover:text-amber-300 transition-colors py-1 relative group">
              <span>Produtos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#sobre" className="hover:text-amber-300 transition-colors py-1 relative group">
              <span>Sobre Nós</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors py-1 relative group"
            >
              <span>Contato</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Actions: WhatsApp Button (Visible on all screens) & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Button */}
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 bg-[#be7b4c] hover:bg-[#a6653b] text-[#120b07] border border-amber-400/40 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider rounded-md shadow-lg shadow-amber-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <img src="/wpp.png" alt="WhatsApp" className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-200 grid place-items-center hover:bg-amber-600 hover:text-stone-950 transition-all active:scale-90"
              aria-label="Abrir menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
      </div>

      {/* Full-Screen Opaque Mobile Navigation Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#120b07] z-[9999] p-6 flex flex-col justify-between md:hidden overflow-y-auto"
          >
            <div className="space-y-8 pt-4">
              {/* Header in Overlay */}
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-5">
                <img src="/logo1.webp" alt="Amadeireira" style={{ height: '38px', width: 'auto' }} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="w-10 h-10 rounded-md bg-[#2a170d] border border-amber-500/40 text-amber-200 grid place-items-center hover:bg-amber-600 hover:text-stone-950 transition-all active:scale-95"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-4 pt-2">
                <a
                  href="#produtos"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-4 rounded-md bg-[#22130b] border border-amber-600/30 text-amber-100 font-semibold text-base shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>Produtos</span>
                  <ArrowRight size={18} className="text-amber-400" />
                </a>

                <a
                  href="https://www.instagram.com/amadeireira_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-4 rounded-md bg-[#22130b] border border-amber-600/30 text-amber-100 font-semibold text-base shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>Instagram</span>
                  <ArrowUpRight size={18} className="text-amber-400" />
                </a>
              </div>
            </div>

            {/* WhatsApp Contact Card */}
            <div className="pt-6 border-t border-amber-900/40 mt-auto">
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-md bg-[#be7b4c] hover:bg-[#a6653b] text-[#120b07] border border-amber-400/40 font-bold text-sm uppercase tracking-wider shadow-xl shadow-amber-950/80 active:scale-95 transition-all"
              >
                <img src="/wpp.png" alt="WhatsApp" style={{ width: '20px', height: '20px' }} />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  return (
    <section className="hero relative overflow-hidden min-h-[100dvh] flex flex-col justify-between" id="top">
      {/* Hero Background Images */}
      <div className="hero-image">
        <Image
          src="/backgrounddesktop.png"
          alt="Mesa de madeira em ambiente sofisticado"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-center"
        />
        <Image
          src="/backgroundmobile.png"
          alt="Mesa de madeira em ambiente sofisticado"
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-cover object-center"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-28 sm:pt-36 pb-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl text-left mx-0 flex flex-col items-start space-y-4 sm:space-y-6"
        >
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#d49a6a] flex items-center justify-start gap-2.5">
            <span className="w-5 h-[1.5px] bg-[#d49a6a] inline-block" />
            <span>Móveis Sob Medida</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-stone-100 leading-[1.08] tracking-tight">
            Madeira<br />
            que conta<br />
            <em className="font-serif italic font-normal text-[#d49a6a] block sm:inline">histórias.</em>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
            Móveis marcantes, acabamento cuidadoso e a beleza natural da madeira em cada detalhe artesanal. Peças únicas para transformar seus ambientes.
          </p>

          {/* Stacked Full-Width Buttons on Mobile / Inline on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5 w-full pt-2">
            <a
              href="#produtos"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 sm:py-3.5 bg-[#be7b4c] hover:bg-[#a6653b] text-[#120b07] border border-amber-400/40 font-extrabold text-xs uppercase tracking-wider rounded-md shadow-xl shadow-amber-950/60 transition-all hover:translate-y-[-2px] active:translate-y-0 group w-full sm:w-auto text-center"
            >
              <span>Ver nosso catálogo</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:py-3.5 bg-stone-950/40 hover:bg-stone-900/60 text-stone-200 hover:text-white border border-amber-500/30 font-bold text-xs uppercase tracking-wider rounded-md backdrop-blur-sm shadow-md transition-all active:scale-[0.98] w-full sm:w-auto text-center"
            >
              <span>Fale conosco</span>
            </a>
          </div>

          {/* 3-Column Value Props Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 sm:pt-6 border-t border-amber-900/40 w-full text-left">
            <div className="space-y-1">
              <div className="text-amber-400">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="font-bold text-[11px] sm:text-xs text-stone-100 leading-tight">Madeira natural</p>
              <p className="text-[10px] text-stone-400 leading-tight">Beleza e durabilidade</p>
            </div>

            <div className="space-y-1">
              <div className="text-amber-400">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="font-bold text-[11px] sm:text-xs text-stone-100 leading-tight">Peças exclusivas</p>
              <p className="text-[10px] text-stone-400 leading-tight">Sob medida para você</p>
            </div>

            <div className="space-y-1">
              <div className="text-amber-400">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="font-bold text-[11px] sm:text-xs text-stone-100 leading-tight">Entrega segura</p>
              <p className="text-[10px] text-stone-400 leading-tight">Para todo o Brasil</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center Scroll Prompt on Mobile */}
      <div className="relative z-10 w-full pb-6 pt-2 sm:hidden flex flex-col items-center justify-center gap-1.5">
        <div className="w-4 h-7 rounded-full border-2 border-amber-500/40 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 bg-amber-400 rounded-full"
          />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
          Role para descobrir
        </span>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-amber-900/30">
      <a href="#top" className="brand">
        <img src="/logo1.webp" alt="Amadeireira" style={{ height: '30px', width: 'auto' }} />
      </a>
      <p>Peças exclusivas de alta marcenaria que aproximam a natureza da sua casa.</p>
      <div className="footer-links">
        <a href="https://www.instagram.com/amadeireira_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={generalWhatsappUrl()} target="_blank" rel="noreferrer">
          <img src="/wpp.png" alt="WhatsApp" style={{ width: '15px', height: '15px' }} /> WhatsApp
        </a>
      </div>
      <small>© {new Date().getFullYear()} Amadeireira. Todos os direitos reservados.</small>
    </footer>
  );
}

export default function Page() {
  const [selected, setSelected] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>(defaultCategories);
  const [settings, setSettings] = useState<CatalogSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    async function init() {
      const [prods, sets, cats] = await Promise.all([
        productService.getAll(),
        settingsService.getSettings(),
        categoryService.getAll()
      ]);

      setProductList(prods.filter(p => p.active));
      setSettings(sets);

      if (cats && cats.length > 0) {
        const activeCatNames = cats.filter(c => c.active).map(c => c.name);
        if (activeCatNames.length > 0) {
          setCategoryList(['Todos', ...activeCatNames]);
        }
      }
    }
    init();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { Todos: productList.length };
    categoryList.forEach(cat => {
      if (cat !== 'Todos') {
        const formatted = formatCategory(cat);
        map[cat] = productList.filter(p => p.category === formatted).length;
      }
    });
    return map;
  }, [productList, categoryList]);

  // Filtered Products
  const filtered = useMemo(() => {
    let result = selected === 'Todos' ? productList : productList.filter(p => p.category === formatCategory(selected));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.wood.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selected, searchQuery, productList]);

  return (
    <main className="bg-[#120b07] text-[#f2e7d8] min-h-screen">
      {/* Banner de Oferta com Efeito Shimmer */}
      {settings.showPromotionBanner && (
        <div className="shimmer-gold text-stone-950 text-center py-2.5 px-4 text-xs font-bold uppercase tracking-widest z-[100] relative border-b border-amber-500/40 shadow-md">
          {settings.promotionBannerText}
        </div>
      )}

      {/* Contêiner Hero com Navbar Flutuante */}
      <div className="relative">
        <Header />
        <Hero />
      </div>

      {/* Seção Catálogo */}
      <section className="catalog" id="produtos">
        {/* Controles de Categoria Aceternity e Busca */}
        <div className="catalog-controls flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10 pb-4 border-b border-amber-900/30">
          <AceternityTabs
            categories={categoryList}
            selected={selected}
            onSelect={setSelected}
            counts={categoryCounts}
          />

          <div className="search-wrap min-w-[260px] md:min-w-[320px]">
            <Search size={16} className="text-amber-500" />
            <input
              type="text"
              placeholder="Buscar por nome, madeira (ex: Pequiá)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-400 hover:text-stone-100 p-1"
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Grade de Produtos com Aceternity Spotlight Cards (2 colunas no celular) */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((product, i) => (
              <AceternitySpotlightCard
                key={product.id}
                index={i}
                product={product}
                onOpen={setModal}
                liveMode={settings.liveMode}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-search py-16 text-center text-stone-400 space-y-4 bg-stone-950/40 rounded-md border border-amber-900/20"
          >
            <p className="text-base font-medium">Nenhuma peça encontrada para "{searchQuery}".</p>
            <button onClick={() => setSearchQuery('')} className="button button-dark text-xs">
              Limpar busca
            </button>
          </motion.div>
        )}
      </section>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        className="floating-whatsapp group"
        href={generalWhatsappUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Amadeireira pelo WhatsApp"
      >
        <img src="/wpp.png" alt="WhatsApp" style={{ width: '24px', height: '24px' }} />
      </a>

      {/* Modal Motion de Produto */}
      <ProductModalMotion
        product={modal}
        onClose={() => setModal(null)}
        liveMode={settings.liveMode}
      />
    </main>
  );
}
