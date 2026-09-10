'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Radio, Sparkles } from 'lucide-react';
import { Product } from '@/data/mockAdminData';
import { formatCurrency } from '@/lib/currency';

interface AceternitySpotlightCardProps {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
  liveMode: boolean;
}

export function AceternitySpotlightCard({ product, index, onOpen, liveMode }: AceternitySpotlightCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Motion 3D tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center for 3D tilt
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    // CSS variables for radial spotlight
    setMouseX(mouseXPos);
    setMouseY(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (product.images.length <= 1) return;
    if (info.offset.x < -35) {
      setPhotoIndex(i => (i + 1) % product.images.length);
    } else if (info.offset.x > 35) {
      setPhotoIndex(i => (i - 1 + product.images.length) % product.images.length);
    }
  };

  const activePrice = liveMode && product.livePrice && product.livePrice.price > 0 ? product.livePrice : product.normalPrice;
  const isPromotional = liveMode && product.livePrice && product.livePrice.price > 0;
  const currentImage = product.images[photoIndex] || '/backgrounddesktop.png';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group spotlight-card flex flex-col justify-between cursor-pointer"
      onClick={() => onOpen(product)}
    >
      {/* Spotlight Radial Follower */}
      <div
        className="spotlight-glow"
        style={{
          ['--mouse-x' as any]: `${mouseX}px`,
          ['--mouse-y' as any]: `${mouseY}px`,
        }}
      />

      {/* Image Container with Drag/Swipe Support */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-950/80 rounded-t-md border-b border-amber-900/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={photoIndex}
            drag={product.images.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0.6, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={currentImage}
              alt={`${product.name}, ${product.wood}`}
              fill
              priority={index < 3}
              sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {isPromotional ? (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-lg border border-rose-400/30 flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3 h-3 text-rose-200" /> Oferta Live
            </span>
          ) : (
            <span className="bg-stone-950/75 backdrop-blur-md text-amber-300/90 text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-sm border border-amber-500/20">
              {product.wood}
            </span>
          )}

          {product.images.length > 1 && (
            <span className="bg-stone-950/80 backdrop-blur-md text-stone-300 text-[10px] font-mono px-2 py-0.5 rounded-sm border border-stone-800">
              {photoIndex + 1}/{product.images.length}
            </span>
          )}
        </div>

        {/* Subtle Swipe Dots Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
            {product.images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === photoIndex ? 'w-4 bg-amber-400' : 'w-1 bg-stone-500/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 space-y-2 sm:space-y-4">
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-amber-500/90 block mb-0.5 sm:mb-1">
            {product.categoryLabel}
          </span>
          <h3 className="font-serif text-sm sm:text-xl font-medium text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1 line-clamp-1">{product.dimensions}</p>
        </div>

        <div className="pt-2 sm:pt-3 border-t border-amber-900/30 flex items-end justify-between gap-1">
          <div className="flex flex-col">
            {activePrice.oldPrice && (
              <span className="text-[9px] sm:text-[11px] text-stone-500 line-through">De: {activePrice.oldPrice}</span>
            )}
            <strong className="text-xs sm:text-sm font-semibold text-amber-100">
              {activePrice.oldPrice ? 'Por: ' : ''}{activePrice.installments}
            </strong>
            <span className="text-[10px] sm:text-xs text-amber-400/90 font-mono">
              À vista: {formatCurrency(activePrice.price)}
            </span>
          </div>

          <button
            onClick={() => onOpen(product)}
            className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs uppercase tracking-wider font-bold text-amber-400 group-hover:text-amber-200 transition-colors shrink-0 pb-0.5"
          >
            <span className="hidden sm:inline">Detalhes</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
