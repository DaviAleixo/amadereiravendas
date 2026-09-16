'use client';

import React from 'react';
import { Tag, Radio, Zap, Check, Plus, Trash2 } from 'lucide-react';
import { PriceGroup } from '@/data/mockAdminData';
import { motion } from 'motion/react';

type PriceGroupInputProps = {
  normalPrice: PriceGroup;
  livePrice?: PriceGroup;
  onNormalPriceChange: (val: PriceGroup) => void;
  onLivePriceChange: (val?: PriceGroup) => void;
}

export function PriceGroupInput({
  normalPrice,
  livePrice,
  onNormalPriceChange,
  onLivePriceChange
}: PriceGroupInputProps) {
  // Enabled if livePrice is an object
  const isLiveEnabled = livePrice !== undefined && livePrice !== null;

  const toggleLivePrice = () => {
    if (isLiveEnabled) {
      onLivePriceChange(undefined);
    } else {
      // Suggest a 10% discount from normal price or default to empty values
      const discountPrice = normalPrice.price ? Math.round(normalPrice.price * 0.9) : 0;
      onLivePriceChange({
        price: discountPrice,
        installments: normalPrice.installments || '',
        oldPrice: normalPrice.price
          ? `R$ ${normalPrice.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : undefined
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Block 1: PREÇO NORMAL */}
      <div className="bg-[#fcfaf7] p-5 rounded-none border border-[#ded6c7] space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-[#ebdcc9] pb-3">
          <div className="p-2 rounded-none bg-[#f2e2cf] text-[#8c5b2b] border border-[#ded1be]">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#17100b] text-sm">Preço Normal (Catálogo Regular)</h4>
            <p className="text-xs text-[#736557]">Valores padrão exibidos no site</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Preço À Vista (R$): *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 text-sm font-semibold">R$</span>
              <input
                type="number"
                step="0.01"
                required
                value={normalPrice.price === 0 ? '' : normalPrice.price}
                onChange={e => onNormalPriceChange({ ...normalPrice, price: parseFloat(e.target.value) || 0 })}
                placeholder="ex: 7990.00"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Parcelamento Comercial: *</label>
            <input
              type="text"
              required
              value={normalPrice.installments || ''}
              onChange={e => onNormalPriceChange({ ...normalPrice, installments: e.target.value })}
              placeholder="ex: 10x de R$ 899,00 ou R$ 12.990,00 em 10x"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Preço Antigo / De (Opcional):</label>
            <input
              type="text"
              value={normalPrice.oldPrice || ''}
              onChange={e => onNormalPriceChange({ ...normalPrice, oldPrice: e.target.value || undefined })}
              placeholder="ex: R$ 24.990,00"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none text-[#736557]"
            />
          </div>
        </div>
      </div>

      {/* Block 2: PREÇO LIVE / PROMOCIONAL */}
      <div className={`p-5 rounded-none border transition-all space-y-4 shadow-sm ${
        isLiveEnabled
          ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300/60'
          : 'bg-[#fcfaf7]/70 border-dashed border-[#ded6c7]'
      }`}>
        <div className="flex items-center justify-between border-b border-[#e2d5c3] pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-none transition-colors ${
              isLiveEnabled ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-[#ded6c7] text-[#5c4a3b]'
            }`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#17100b] text-sm flex items-center gap-1.5">
                <span>Preço Live / Promocional</span>
                {isLiveEnabled && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-rose-600 text-white rounded-none">
                    ATIVO
                  </span>
                )}
              </h4>
              <p className="text-xs text-[#736557]">Exibido apenas quando a Live estiver ligada</p>
            </div>
          </div>

          {/* Master Toggle Button */}
          <motion.button
            type="button"
            onClick={toggleLivePrice}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center h-7 w-14 rounded-none p-0.5 transition-colors cursor-pointer border ${
              isLiveEnabled
                ? 'bg-rose-700 border-rose-800'
                : 'bg-stone-300 border-stone-400'
            }`}
            title={isLiveEnabled ? 'Desativar preço promocional' : 'Ativar preço promocional'}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-6 h-6 bg-white shadow-md rounded-none flex items-center justify-center ${
                isLiveEnabled ? 'ml-auto text-rose-700' : 'mr-auto text-stone-500'
              }`}
            >
              {isLiveEnabled ? <Check className="w-3.5 h-3.5" /> : <span className="text-[9px] font-bold">OFF</span>}
            </motion.div>
          </motion.button>
        </div>

        {isLiveEnabled ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                Preço À Vista da Live (R$): *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-rose-500 text-sm font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={livePrice?.price === 0 ? '' : (livePrice?.price ?? '')}
                  onChange={e => onLivePriceChange({
                    price: parseFloat(e.target.value) || 0,
                    installments: livePrice?.installments || '',
                    oldPrice: livePrice?.oldPrice
                  })}
                  placeholder="ex: 6990.00"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-bold text-rose-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                Parcelamento Promocional na Live: *
              </label>
              <input
                type="text"
                required
                value={livePrice?.installments || ''}
                onChange={e => onLivePriceChange({
                  price: livePrice?.price || 0,
                  installments: e.target.value,
                  oldPrice: livePrice?.oldPrice
                })}
                placeholder="ex: 10x de R$ 799,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                Preço de Referência Antigo / "De" (Opcional):
              </label>
              <input
                type="text"
                value={livePrice?.oldPrice || ''}
                onChange={e => onLivePriceChange({
                  price: livePrice?.price || 0,
                  installments: livePrice?.installments || '',
                  oldPrice: e.target.value || undefined
                })}
                placeholder="ex: De R$ 7.990,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none text-[#736557]"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={toggleLivePrice}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover preço promocional deste produto</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#17100b]">Preço Promocional Desativado</p>
              <p className="text-[11px] text-[#736557]">
                Este produto manterá o preço normal de tabela mesmo quando a Live for transmitida.
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleLivePrice}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ativar Preço da Live</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
