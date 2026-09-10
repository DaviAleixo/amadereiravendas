'use client';

import React, { useState } from 'react';
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
          <label className="block text-sm font-bold text-stone-900">Galeria de Imagens do Produto</label>

        </div>
        <button
          type="button"
          onClick={() => setShowInput(!showInput)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Foto</span>
        </button>
      </div>

      {showInput && (
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-fadeIn">
          <label className="block text-xs font-semibold text-stone-700">URL da Imagem ou Caminho Local (ex: /prancharesina.jpeg):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              placeholder="/minha-foto.jpeg ou https://..."
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-sm transition-colors"
            >
              Adicionar
            </button>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">Sugestões de fotos existentes:</p>
            <div className="flex flex-wrap gap-2">
              {presetImages.map(img => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    if (!images.includes(img)) onChange([...images, img]);
                  }}
                  className="text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-lg hover:border-amber-500 hover:text-amber-900 transition-colors"
                >
                  {img}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Images */}
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center bg-stone-50">
          <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">Nenhuma foto adicionada ainda</p>
          <p className="text-xs text-stone-500 mt-0.5">Clique em "+ Adicionar Foto" para incluir fotos ao produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imgUrl, index) => (
            <div
              key={`${imgUrl}-${index}`}
              className={`group relative bg-stone-100 rounded-2xl overflow-hidden border transition-all ${
                index === 0 ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-square relative overflow-hidden bg-stone-900/10">
                <img
                  src={imgUrl}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Badge Principal */}
              {index === 0 && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-amber-950/90 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-600/40">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Principal
                </span>
              )}

              {/* Controls Toolbar */}
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'left')}
                      className="p-1.5 bg-stone-900/90 text-white rounded-lg hover:bg-amber-800 transition-colors"
                      title="Mover para esquerda (tornar foto principal)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'right')}
                      className="p-1.5 bg-stone-900/90 text-white rounded-lg hover:bg-amber-800 transition-colors"
                      title="Mover para direita"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 bg-rose-900/90 text-rose-200 rounded-lg hover:bg-rose-700 transition-colors"
                  title="Remover foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
