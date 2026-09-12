'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, ArrowRight, Star } from 'lucide-react';

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    let formatted = newImageUrl.trim();
    if (!formatted.startsWith('/') && !formatted.startsWith('http')) {
      formatted = '/' + formatted;
    }
    onChange([...images, formatted]);
    setNewImageUrl('');
    setShowInput(false);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const presetImages = [
    '/mesacascatamadeiraangelim.jpeg',
    '/mesacascatapequia.jpeg',
    '/mesamadeiraangelim1.jpeg',
    '/aparador1.jpeg',
    '/prancharesina.jpeg',
    '/baseraizaroeira.jpeg',
    '/cadeiraitaliacores.jpeg'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">Galeria de Imagens do Produto</label>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInput(!showInput)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c5b2b] bg-[#fcf6eb] hover:bg-[#f5ebd6] border border-[#ded1be] px-3.5 py-1.5 rounded-none transition-colors shadow-sm uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Foto</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 bg-[#fcfaf7] rounded-none border border-[#ded6c7] space-y-3 overflow-hidden"
          >
            <label className="block text-xs font-bold text-[#5c4a3b]">URL da Imagem ou Caminho Local (ex: /prancharesina.jpeg):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="/minha-foto.jpeg ou https://..."
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddImage}
                className="px-4 py-2 text-xs font-bold text-white bg-[#8c5b2b] hover:bg-[#a66d35] rounded-none shadow-sm transition-colors uppercase tracking-wider"
              >
                Adicionar
              </motion.button>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-extrabold text-[#8c7a67] uppercase tracking-wider mb-2">Sugestões de fotos existentes:</p>
              <div className="flex flex-wrap gap-2">
                {presetImages.map(img => (
                  <motion.button
                    key={img}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (!images.includes(img)) onChange([...images, img]);
                    }}
                    className="text-xs bg-white border border-[#ded6c7] px-2.5 py-1 rounded-none hover:border-[#8c5b2b] hover:text-[#8c5b2b] transition-colors"
                  >
                    {img}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipeable Carousel of Images */}
      {images.length === 0 ? (
        <div className="border border-dashed border-[#ded6c7] rounded-none p-6 text-center bg-[#fcfaf7]">
          <ImageIcon className="w-8 h-8 text-[#a89988] mx-auto mb-1.5" />
          <p className="text-xs font-bold text-[#17100b]">Nenhuma foto adicionada ainda</p>
          <p className="text-[11px] text-[#736557] mt-0.5">Clique em "+ Adicionar Foto" para incluir fotos ao produto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#736557] font-semibold px-1">
            <span>{images.length} {images.length === 1 ? 'foto cadastrada' : 'fotos cadastradas'}</span>
            {images.length > 2 && <span className="text-[#8c5b2b] font-bold">← Arraste para o lado →</span>}
          </div>

          {/* Horizontal Scroll Carousel */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x snap-mandatory focus:outline-none">
            {images.map((imgUrl, index) => (
              <motion.div
                key={`${imgUrl}-${index}`}
                whileHover={{ y: -2 }}
                className={`group relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 snap-start bg-stone-100 rounded-none overflow-hidden border transition-all ${
                  index === 0 ? 'border-[#8c5b2b] ring-1 ring-[#8c5b2b] shadow-md' : 'border-[#ded6c7] hover:border-[#c8a97e] shadow-sm'
                }`}
              >
                {/* Image Preview */}
                <div className="w-full h-full relative overflow-hidden bg-stone-900/10">
                  <img
                    src={imgUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover rounded-none"
                  />
                </div>

                {/* Badge Principal */}
                {index === 0 && (
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-[#1a0f08]/95 backdrop-blur-md text-[#fae4bb] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none border border-[#c8a97e]/60 shadow-sm">
                    <Star className="w-3 h-3 fill-[#fae4bb] text-[#fae4bb]" /> Principal
                  </span>
                )}

                {/* Position Index Badge */}
                <span className="absolute top-2 right-2 z-10 bg-stone-950/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none backdrop-blur-sm border border-stone-800">
                  {index + 1}/{images.length}
                </span>

                {/* Controls Toolbar */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent flex items-center justify-between z-10 transition-opacity">
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'left')}
                        className="p-1.5 bg-stone-900/95 text-white rounded-none hover:bg-[#8c5b2b] transition-colors shadow-sm"
                        title="Mover para esquerda"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'right')}
                        className="p-1.5 bg-stone-900/95 text-white rounded-none hover:bg-[#8c5b2b] transition-colors shadow-sm"
                        title="Mover para direita"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 bg-rose-950/95 text-rose-200 rounded-none hover:bg-rose-700 transition-colors shadow-sm border border-rose-800/40"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
