'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, X, Search, Radio } from 'lucide-react'
import { categories as defaultCategories, formatCategory } from '@/data/products'
import { formatCurrency } from '@/lib/currency'
import { generalWhatsappUrl, productWhatsappUrl } from '@/lib/whatsapp'
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { categoryService } from '@/services/categoryService'
import { Product, CatalogSettings, INITIAL_SETTINGS } from '@/data/mockAdminData'

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Amadeireira, início">
        <img src="/logo1.webp" alt="Amadeireira" style={{ height: '40px', width: 'auto' }} />
      </a>
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <a href="#produtos" onClick={() => setOpen(false)}>Produtos</a>
        <a href="https://www.instagram.com/amadeireira_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
          Instagram <ArrowUpRight size={13} />
        </a>
        <a className="nav-contact" href={generalWhatsappUrl()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
          <img src="/wpp.png" alt="WhatsApp" style={{ width: '15px', height: '15px' }} /> WhatsApp
        </a>
        <a href="/admin" className="text-xs bg-stone-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors">
          Painel Admin
        </a>
      </nav>
      <button className="menu-button" aria-label="Abrir menu" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">A beleza do natural</p>
        <h1>Madeira que<br /><em>transforma</em> ambientes.</h1>
        <p className="hero-description">Móveis marcantes, acabamento cuidadoso e a beleza natural da madeira em cada detalhe.</p>
        <div className="hero-actions">
          <a className="button button-dark" href="#produtos">Conheça nossos produtos <ArrowRight size={16} /></a>
          <a className="text-link" href={generalWhatsappUrl()} target="_blank" rel="noreferrer">Fale conosco <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="hero-image">
        <Image src="/capa.webp" alt="Mesa de madeira em ambiente sofisticado" fill priority sizes="(max-width: 800px) 100vw, 57vw" />
      </div>
      <span className="hero-mark">01 / AMADEIREIRA</span>
    </section>
  )
}

function CategoryFilter({
  selected,
  setSelected,
  categoryList
}: {
  selected: string;
  setSelected: (value: string) => void;
  categoryList: string[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll, categoryList])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsMouseDown(true)
    setHasMoved(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeftState(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    if (Math.abs(walk) > 4) {
      setHasMoved(true)
      setIsDragging(true)
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk
    checkScroll()
  }

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false)
    setTimeout(() => setIsDragging(false), 50)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return
    if (e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY * 0.8
      checkScroll()
    }
  }

  const scrollByAmount = (amount: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    setTimeout(checkScroll, 300)
  }

  const handleCategoryClick = (category: string) => {
    if (hasMoved || isDragging) return
    setSelected(category)
  }

  return (
    <div className="category-filter-wrapper">
      {canScrollLeft && (
        <button
          className="scroll-arrow-btn left-btn"
          aria-label="Rolar para esquerda"
          onClick={() => scrollByAmount(-200)}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div
        ref={scrollRef}
        className={`category-scroll ${isDragging ? 'is-dragging' : ''}`}
        role="tablist"
        aria-label="Filtrar por categoria"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onScroll={checkScroll}
        onWheel={handleWheel}
      >
        {categoryList.map(category => (
          <button
            role="tab"
            aria-selected={selected === category}
            className={selected === category ? 'active' : ''}
            key={category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          className="scroll-arrow-btn right-btn"
          aria-label="Rolar para direita"
          onClick={() => scrollByAmount(200)}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

function ProductCard({ product, index, onOpen, liveMode }: { product: Product; index: number; onOpen: (p: Product) => void; liveMode: boolean }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const next = () => setPhotoIndex(i => (i + 1) % product.images.length)
  const prev = () => setPhotoIndex(i => (i - 1 + product.images.length) % product.images.length)

  // Live Mode Price Rule
  const activePrice = liveMode && product.livePrice && product.livePrice.price > 0 ? product.livePrice : product.normalPrice
  const isPromotional = liveMode && product.livePrice && product.livePrice.price > 0

  return (
    <article className="product-card">
      <div className="product-image-wrap" onClick={() => onOpen(product)}>
        <Image
          src={product.images[photoIndex] || '/capa.webp'}
          alt={`${product.name}, ${product.wood}`}
          fill
          priority={index < 4}
          sizes="(max-width: 600px) 50vw, (max-width: 1100px) 50vw, 33vw"
          className="product-image"
        />
        {isPromotional && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md z-10 flex items-center gap-1 animate-pulse">
            <Radio size={12} /> Oferta Live
          </span>
        )}
        {product.images.length > 1 && <span className="image-count">{photoIndex + 1} / {product.images.length}</span>}
        {product.images.length > 1 && (
          <>
            <button className="gallery-arrow left" aria-label="Foto anterior" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={16} />
            </button>
            <button className="gallery-arrow right" aria-label="Próxima foto" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      <div className="product-info">
        <div>
          <p className="product-category">{product.categoryLabel}</p>
          <h3 className="product-name-button" onClick={() => onOpen(product)}>{product.name}</h3>
          <p className="dimensions">{product.dimensions}</p>
        </div>
        <div className="product-bottom">
          <div className="product-prices">
            {activePrice.oldPrice && <span className="price-old">De: {activePrice.oldPrice}</span>}
            <strong className="price-installments">{activePrice.oldPrice ? 'Por: ' : ''}{activePrice.installments}</strong>
            <span className="price-cash">À vista: {formatCurrency(activePrice.price)}</span>
          </div>
          <button className="interest-link" onClick={() => onOpen(product)}>Ver detalhes <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </article>
  )
}

function ProductModal({ product, onClose, liveMode }: { product: Product; onClose: () => void; liveMode: boolean }) {
  const [index, setIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', key)
    }
  }, [onClose])

  const next = () => setIndex(i => (i + 1) % product.images.length)
  const prev = () => setIndex(i => (i - 1 + product.images.length) % product.images.length)

  const activePrice = liveMode && product.livePrice && product.livePrice.price > 0 ? product.livePrice : product.normalPrice

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" aria-label="Fechar detalhes" onClick={onClose}><X size={20} /></button>
        <div className="modal-gallery">
          <Image src={product.images[index] || '/capa.webp'} alt={`${product.name}, imagem ${index + 1}`} fill sizes="(max-width: 800px) 100vw, 60vw" priority />
          <div className="modal-controls">
            {product.images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Imagem anterior"><ChevronLeft size={18} /></button>
                <span>{index + 1} / {product.images.length}</span>
                <button onClick={next} aria-label="Próxima imagem"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
        </div>
        <div className="modal-details">
          <p className="eyebrow">{product.categoryLabel}</p>
          <h2>{product.name}</h2>
          <p className="modal-description">{product.description}</p>
          <dl>
            <div><dt>Medidas</dt><dd>{product.dimensions}</dd></div>
            <div><dt>Material</dt><dd>{product.wood}</dd></div>
          </dl>
          <div className="modal-price">
            <div className="product-prices">
              {activePrice.oldPrice && <span className="price-old">De: {activePrice.oldPrice}</span>}
              <strong className="price-installments">{activePrice.oldPrice ? 'Por: ' : ''}{activePrice.installments}</strong>
              <span className="price-cash">À vista: {formatCurrency(activePrice.price)}</span>
            </div>
          </div>
          <a className="button button-whatsapp" href={productWhatsappUrl(product as any)} target="_blank" rel="noreferrer">
            <img src="/wpp.png" alt="WhatsApp" style={{ width: '17px', height: '17px' }} /> Tenho interesse
          </a>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <a href="#top" className="brand"><img src="/logo1.webp" alt="Amadeireira" style={{ height: '30px', width: 'auto' }} /></a>
      <p>Peças que aproximam a natureza da casa.</p>
      <div className="footer-links">
        <a href="https://www.instagram.com/amadeireira_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">Instagram</a>
        <a href={generalWhatsappUrl()} target="_blank" rel="noreferrer"><img src="/wpp.png" alt="WhatsApp" style={{ width: '15px', height: '15px' }} /> WhatsApp</a>
        <a href="/admin">Painel Administrativo</a>
      </div>
      <small>© {new Date().getFullYear()} Amadeireira. Todos os direitos reservados.</small>
    </footer>
  )
}

export default function Page() {
  const [selected, setSelected] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])
  const [categoryList, setCategoryList] = useState<string[]>(defaultCategories)
  const [settings, setSettings] = useState<CatalogSettings>(INITIAL_SETTINGS)

  useEffect(() => {
    async function init() {
      const [prods, sets, cats] = await Promise.all([
        productService.getAll(),
        settingsService.getSettings(),
        categoryService.getAll()
      ])
      setProductList(prods.filter(p => p.active))
      setSettings(sets)

      if (cats && cats.length > 0) {
        const activeCatNames = cats.filter(c => c.active).map(c => c.name)
        if (activeCatNames.length > 0) {
          setCategoryList(['Todos', ...activeCatNames])
        }
      }
    }
    init()
  }, [])

  const filtered = useMemo(() => {
    let result = selected === 'Todos' ? productList : productList.filter(p => p.category === formatCategory(selected))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.wood.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
    }
    return result
  }, [selected, searchQuery, productList])

  return (
    <main>
      {settings.showPromotionBanner && (
        <div style={{ background: '#c8a97e', color: '#1a1a1a', textAlign: 'center', padding: '10px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', zIndex: 100, position: 'absolute', top: 0, left: 0, right: 0 }}>
          {settings.promotionBannerText}
        </div>
      )}
      <Header />
      <Hero />
      <section className="catalog" id="produtos">
        <div className="catalog-controls">
          <CategoryFilter selected={selected} setSelected={setSelected} categoryList={categoryList} />
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
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                index={i}
                product={product}
                onOpen={setModal}
                liveMode={settings.liveMode}
              />
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <p>Nenhuma peça encontrada para "{searchQuery}".</p>
            <button onClick={() => setSearchQuery('')} className="text-link">Limpar busca</button>
          </div>
        )}
      </section>
      <Footer />
      <a className="floating-whatsapp" href={generalWhatsappUrl()} target="_blank" rel="noreferrer" aria-label="Falar com a Amadeireira pelo WhatsApp">
        <img src="/wpp.png" alt="WhatsApp" style={{ width: '22px', height: '22px' }} />
      </a>
      {modal && <ProductModal product={modal} onClose={() => setModal(null)} liveMode={settings.liveMode} />}
    </main>
  )
}
