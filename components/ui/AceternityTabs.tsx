'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface AceternityTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  counts?: Record<string, number>;
}

export function AceternityTabs({ categories, selected, onSelect, counts }: AceternityTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <div className="relative flex items-center w-full max-w-full overflow-hidden -mx-5 px-5 sm:mx-0 sm:px-0">
      {/* Scroll indicator fade edges on mobile */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#120b07] to-transparent z-10 sm:hidden" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#120b07] to-transparent z-10 sm:hidden" />

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-1.5 sm:gap-5 overflow-x-auto scrollbar-none py-1 px-1 w-full select-none cursor-grab active:cursor-grabbing border-b border-amber-900/30"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => {
          const isSelected = selected === cat;
          const count = counts?.[cat];

          return (
            <button
              key={cat}
              onClick={() => {
                if (!hasDragged) {
                  onSelect(cat);
                }
              }}
              className={`relative pb-2 pt-1 px-1.5 sm:px-3 text-[11px] sm:text-sm font-medium tracking-tight sm:tracking-wide transition-colors whitespace-nowrap flex items-center gap-1 shrink-0 ${
                isSelected ? 'text-amber-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{cat}</span>
              {typeof count === 'number' && (
                <span className={`text-[9px] font-mono px-1 py-0.2 rounded-full border ${
                  isSelected ? 'bg-amber-950/80 border-amber-500/40 text-amber-200' : 'bg-stone-900/90 border-stone-800 text-stone-400'
                }`}>
                  {count}
                </span>
              )}
              {isSelected && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
