'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '@/data/mockAdminData';
import { formatCurrency } from '@/lib/currency';
import { productWhatsappUrl } from '@/lib/whatsapp';

interface ProductModalMotionProps {
  product: Product | null;
  onClose: () => void;
  liveMode: boolean;
}

export function ProductModalMotion({ product, onClose, liveMode }: ProductModalMotionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!product) return;
    setIndex(0);
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (product.images.length <= 1) return;
    if (info.offset.x < -35) {
      setIndex(i => (i + 1) % product.images.length);
    } else if (info.offset.x > 35) {
      setIndex(i => (i - 1 + product.images.length) % product.images.length);
    }
  };

  const activePrice = liveMode && product.livePrice && product.livePrice.price > 0 ? product.livePrice : product.normalPrice;
  const currentImage = product.images[index] || '/backgrounddesktop.png';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-4xl bg-stone-900 border border-amber-600/30 rounded-md shadow-2xl shadow-stone-950 overflow-hidden z-10 flex flex-col md:flex-row my-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-md bg-stone-950/80 border border-amber-500/30 text-amber-200 grid place-items-center hover:bg-amber-600 hover:text-stone-950 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Gallery with Drag/Swipe Support */}
          <div className="relative md:w-7/12 aspect-square md:aspect-auto bg-stone-950 flex flex-col justify-between p-4 border-b md:border-b-0 md:border-r border-amber-900/30 min-h-[320px]">
            <div className="relative flex-1 w-full rounded-md overflow-hidden min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  drag={product.images.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={currentImage}
                    alt={`${product.name}, imagem ${index + 1}`}
                    fill
                    priority
                    sizes="(max-width: 800px) 100vw, 55vw"
                    className="object-cover pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`relative w-12 h-12 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                      index === i ? 'border-amber-500 shadow-md' : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="md:w-5/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500 block">
                {product.categoryLabel}
              </span>
              <h2 className="font-serif text-3xl font-normal text-stone-100 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {product.description || 'Peça artesanal produzida com acabamento de alto padrão e madeira natural selecionada.'}
              </p>

              <dl className="grid grid-cols-1 gap-2 pt-4 border-t border-amber-900/30 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-800/50">
                  <dt className="text-stone-400">Dimensões:</dt>
                  <dd className="font-medium text-stone-200">{product.dimensions}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/50">
                  <dt className="text-stone-400">Madeira:</dt>
                  <dd className="font-medium text-stone-200">{product.wood}</dd>
                </div>
              </dl>
            </div>

            {/* Pricing & WhatsApp Call to Action */}
            <div className="space-y-4 pt-4 border-t border-amber-900/30">
              <div>
                {activePrice.oldPrice && (
                  <span className="text-xs text-stone-500 line-through block">De: {activePrice.oldPrice}</span>
                )}
                <strong className="text-xl font-bold text-amber-100 block">
                  {activePrice.oldPrice ? 'Por: ' : ''}{activePrice.installments}
                </strong>
                <span className="text-xs text-amber-400 font-mono">
                  À vista: {formatCurrency(activePrice.price)}
                </span>
              </div>

              <a
                href={productWhatsappUrl(product as any)}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <img src="/wpp.png" alt="WhatsApp" className="w-4 h-4" />
                <span>Tenho Interesse via WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
