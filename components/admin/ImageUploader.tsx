'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Trash2, ArrowLeft, ArrowRight, Star, Upload, Loader2, X } from 'lucide-react';
import { productService } from '@/services/productService';
import { resolveProductImageUrl } from '@/lib/imageUrl';

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError('');
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setUploadError('Por favor selecione arquivos de imagem válidos (JPEG, PNG, WEBP).');
      setUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgress(`Enviando foto ${i + 1} de ${validFiles.length}...`);
      
      try {
        const publicUrl = await productService.uploadImage(file);
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        } else {
          setUploadError(`Falha ao enviar ${file.name}`);
        }
      } catch (err: any) {
        setUploadError(`Erro ao enviar ${file.name}: ${err.message || 'Falha de rede'}`);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setUploading(false);
    setUploadProgress('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  return (
    <div className="space-y-4">
      {/* Hidden Multiple File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => handleFiles(e.target.files)}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Fotos do Produto (Upload Direto)
        </label>
        {images.length > 0 && (
          <span className="text-xs text-[#8c5b2b] font-bold">
            {images.length} {images.length === 1 ? 'foto cadastrada' : 'fotos cadastradas'}
          </span>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-none p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#8c5b2b] bg-[#fdf8f0]'
            : 'border-[#ded6c7] hover:border-[#8c5b2b] bg-[#fcfaf7] hover:bg-[#faf5ec]'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-2.5">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#8c5b2b] animate-spin" />
              <p className="text-xs font-bold text-[#17100b]">{uploadProgress || 'Processando envio...'}</p>
              <p className="text-[11px] text-[#736557]">Salvando no Supabase Storage na nuvem</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-none bg-[#f2e6d6] text-[#8c5b2b] flex items-center justify-center shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-[#17100b]">
                  Clique para selecionar fotos ou arraste arquivos aqui
                </p>
                <p className="text-[11px] text-[#736557]">
                  Você pode selecionar uma ou várias fotos de uma vez (JPG, PNG, WEBP)
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-4 py-2 bg-[#8c5b2b] hover:bg-[#a66d35] text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-sm transition-colors"
              >
                Selecionar do Computador / Celular
              </button>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-xs text-rose-600 font-semibold">{uploadError}</p>
      )}

      {/* Gallery Carousel */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#736557] font-semibold px-1">
            <span>A primeira foto será a capa do anúncio:</span>
            {images.length > 2 && <span className="text-[#8c5b2b] font-bold">← Arraste para o lado →</span>}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x snap-mandatory focus:outline-none">
            {images.map((rawUrl, index) => {
              const displayUrl = resolveProductImageUrl(rawUrl);

              return (
                <motion.div
                  key={`${rawUrl}-${index}`}
                  whileHover={{ y: -2 }}
                  className={`group relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 snap-start bg-stone-100 rounded-none overflow-hidden border transition-all ${
                    index === 0 ? 'border-[#8c5b2b] ring-2 ring-[#8c5b2b] shadow-md' : 'border-[#ded6c7] hover:border-[#c8a97e] shadow-sm'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="w-full h-full relative overflow-hidden bg-stone-900/10">
                    <img
                      src={displayUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-none"
                      onError={e => {
                        // Fallback placeholder if image not found
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-stone-200');
                        }
                      }}
                    />
                  </div>

                  {/* Badge Principal (Capa) ou Posição */}
                  {index === 0 ? (
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-[#1a0f08]/95 backdrop-blur-md text-[#fae4bb] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none border border-[#c8a97e]/60 shadow-sm">
                      <Star className="w-3 h-3 fill-[#fae4bb] text-[#fae4bb]" /> Capa
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 z-10 bg-stone-950/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none backdrop-blur-sm border border-stone-800">
                      {index + 1}/{images.length}
                    </span>
                  )}

                  {/* Botão X para Excluir Foto Individual no topo */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 z-20 w-7 h-7 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center rounded-none shadow-md transition-all border border-white/20 cursor-pointer"
                    title={`Excluir foto ${index + 1}`}
                    aria-label={`Excluir foto ${index + 1}`}
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Controls Toolbar (Reorganizar / Mover) */}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent flex items-center justify-between z-10 transition-opacity">
                    <div className="flex gap-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'left')}
                          className="p-1.5 bg-stone-900/95 text-white rounded-none hover:bg-[#8c5b2b] transition-colors shadow-sm"
                          title="Tornar capa / Mover para esquerda"
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
                      className="inline-flex items-center gap-1 px-2 py-1 bg-rose-950/90 text-rose-200 text-[10px] font-bold rounded-none hover:bg-rose-700 transition-colors shadow-sm border border-rose-800/40"
                      title="Excluir foto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
