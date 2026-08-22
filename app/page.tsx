'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, MessageCircle, X, Search } from 'lucide-react'
import { categories, formatCategory, products, type Product } from '@/data/products'
import { formatCurrency } from '@/lib/currency'
import { generalWhatsappUrl, productWhatsappUrl } from '@/lib/whatsapp'

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><a href="#top" className="brand" aria-label="Amadeireira, início"><span>AM</span><span>AMADEIREIRA</span></a><nav className={`nav ${open ? 'is-open' : ''}`}><a href="#produtos" onClick={() => setOpen(false)}>Produtos</a><a href="https://www.instagram.com/amadeireira_/" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Instagram <ArrowUpRight size={13} /></a><a className="nav-contact" href={generalWhatsappUrl()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}><MessageCircle size={15} /> WhatsApp</a></nav><button className="menu-button" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></header>
}

function Hero() { return <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">A beleza do natural</p><h1>Madeira que<br /><em>transforma</em> ambientes.</h1><p className="hero-description">Móveis marcantes, acabamento cuidadoso e a beleza natural da madeira em cada detalhe.</p><div className="hero-actions"><a className="button button-dark" href="#produtos">Conheça nossos produtos <ArrowRight size={16} /></a><a className="text-link" href={generalWhatsappUrl()} target="_blank" rel="noreferrer">Fale conosco <ArrowUpRight size={15} /></a></div></div><div className="hero-image"><Image src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=90" alt="Mesa de madeira em ambiente sofisticado" fill priority sizes="(max-width: 800px) 100vw, 57vw" /></div><span className="hero-mark">01 / AMADEIREIRA</span></section> }

function CategoryFilter({ selected, setSelected }: { selected: string; setSelected: (value: string) => void }) { return <div className="category-scroll" role="tablist" aria-label="Filtrar por categoria">{categories.map(category => <button role="tab" aria-selected={selected === category} className={selected === category ? 'active' : ''} key={category} onClick={() => setSelected(category)}>{category}</button>)}</div> }

function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const [index, setIndex] = useState(0)
  const next = () => setIndex(i => (i + 1) % product.images.length)
  const prev = () => setIndex(i => (i - 1 + product.images.length) % product.images.length)
  return <article className="product-card"><div className="product-image-wrap" onClick={() => onOpen(product)}><Image src={product.images[index]} alt={`${product.name}, ${product.wood}`} fill sizes="(max-width: 600px) 50vw, (max-width: 1100px) 50vw, 33vw" className="product-image" />{product.images.length > 1 && <span className="image-count">{index + 1} / {product.images.length}</span>}{product.images.length > 1 && <><button className="gallery-arrow left" aria-label="Foto anterior" onClick={e => { e.stopPropagation(); prev() }}><ChevronLeft size={16} /></button><button className="gallery-arrow right" aria-label="Próxima foto" onClick={e => { e.stopPropagation(); next() }}><ChevronRight size={16} /></button></>}</div><div className="product-info"><div><p className="product-category">{product.categoryLabel}</p><h3 className="product-name-button" onClick={() => onOpen(product)}>{product.name}</h3><p className="dimensions">{product.dimensions}</p></div><div className="product-bottom"><div className="product-prices">{product.oldPrice && <span className="price-old">De: {product.oldPrice}</span>}<strong className="price-installments">{product.oldPrice ? 'Por: ' : ''}{product.installments}</strong><span className="price-cash">À vista: {formatCurrency(product.price)}</span></div><button className="interest-link" onClick={() => onOpen(product)}>Ver detalhes <ArrowUpRight size={15} /></button></div></div></article>
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  useEffect(() => { document.body.style.overflow = 'hidden'; const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', key); return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) } }, [onClose])
  const next = () => setIndex(i => (i + 1) % product.images.length)
  const prev = () => setIndex(i => (i - 1 + product.images.length) % product.images.length)
  const handleTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); }
  const handleTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); }
  const handleTouchEnd = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; if (distance > 50) next(); if (distance < -50) prev(); }
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal"><button className="modal-close" aria-label="Fechar detalhes" onClick={onClose}><X size={20} /></button><div className="modal-gallery" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}><Image src={product.images[index]} alt={`${product.name}, imagem ${index + 1}`} fill sizes="(max-width: 800px) 100vw, 60vw" priority /><div className="modal-controls">{product.images.length > 1 && <><button onClick={prev} aria-label="Imagem anterior"><ChevronLeft size={18} /></button><span>{index + 1} / {product.images.length}</span><button onClick={next} aria-label="Próxima imagem"><ChevronRight size={18} /></button></>}</div></div><div className="modal-details"><p className="eyebrow">{product.categoryLabel}</p><h2>{product.name}</h2><p className="modal-description">{product.description}</p><dl><div><dt>Medidas</dt><dd>{product.dimensions}</dd></div><div><dt>Material</dt><dd>{product.wood}</dd></div></dl><div className="modal-price"><div className="product-prices">{product.oldPrice && <span className="price-old">De: {product.oldPrice}</span>}<strong className="price-installments">{product.oldPrice ? 'Por: ' : ''}{product.installments}</strong><span className="price-cash">À vista: {formatCurrency(product.price)}</span></div></div><a className="button button-whatsapp" href={productWhatsappUrl(product)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Tenho interesse</a></div></div></div>
}

function FinalCTA() { return <section className="final-cta"><div><p className="eyebrow">Uma peça para chamar de sua</p><h2>Encontrou a peça<br /><em>ideal?</em></h2></div><div className="cta-side"><p>Fale diretamente com nossa equipe e tire suas dúvidas.</p><a className="button button-light" href={generalWhatsappUrl()} target="_blank" rel="noreferrer">Falar pelo WhatsApp <ArrowUpRight size={16} /></a></div></section> }

function Footer() { return <footer><a href="#top" className="brand"><span>AM</span><span>AMADEIREIRA</span></a><p>Peças que aproximam a natureza da casa.</p><div className="footer-links"><a href="https://www.instagram.com/amadeireira_/" target="_blank" rel="noreferrer">Instagram</a><a href={generalWhatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a><a href="https://amadeireira.com.br/" target="_blank" rel="noreferrer">Site principal <ArrowUpRight size={13} /></a></div><small>© {new Date().getFullYear()} Amadeireira. Todos os direitos reservados.</small></footer> }

export default function Page() { 
  const [selected, setSelected] = useState('Todos'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<Product | null>(null); 
  
  const filtered = useMemo(() => {
    let result = selected === 'Todos' ? products : products.filter(p => p.category === formatCategory(selected));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.wood.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    return result;
  }, [selected, searchQuery]); 
  
  return (
    <main>
      <div style={{ background: '#c8a97e', color: '#1a1a1a', textAlign: 'center', padding: '10px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', zIndex: 100, position: 'absolute', top: 0, left: 0, right: 0 }}>
        🔴 Catálogo Especial — Live Shop 22/Ago
      </div>
      <Header />
      <Hero />
      <section className="catalog" id="produtos">
        <div className="catalog-controls">
          <CategoryFilter selected={selected} setSelected={setSelected} />
          <div className="search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Buscar por peça, madeira..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
        
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(product => <ProductCard key={product.id} product={product} onOpen={setModal} />)}
          </div>
        ) : (
          <div className="empty-search">
            <p>Nenhuma peça encontrada para "{searchQuery}".</p>
            <button onClick={() => setSearchQuery('')} className="text-link">Limpar busca</button>
          </div>
        )}
      </section>
      <Footer />
      <a className="floating-whatsapp" href={generalWhatsappUrl()} target="_blank" rel="noreferrer" aria-label="Falar com a Amadeireira pelo WhatsApp"><MessageCircle size={22} /></a>
      {modal && <ProductModal product={modal} onClose={() => setModal(null)} />}
    </main>
  );
}
