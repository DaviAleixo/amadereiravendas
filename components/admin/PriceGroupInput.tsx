'use client';

import React from 'react';
import { Tag, Radio } from 'lucide-react';
import { PriceGroup } from '@/data/mockAdminData';

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
  const hasLivePrice = !!livePrice && (livePrice.price > 0 || !!livePrice.installments);

  const handleToggleLivePrice = (enable: boolean) => {
    if (enable) {
      onLivePriceChange({
        price: normalPrice.price ? Math.round(normalPrice.price * 0.9) : 0,
        installments: normalPrice.installments || '',
        oldPrice: normalPrice.price ? `R$ ${normalPrice.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : undefined
      });
    } else {
      onLivePriceChange(undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Block 1: PREÇO NORMAL */}
      <div className="bg-[#fcfaf7] p-5 rounded-none border border-[#ded6c7] space-y-4">
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
                value={normalPrice.price || ''}
                onChange={e => onNormalPriceChange({ ...normalPrice, price: parseFloat(e.target.value) || 0 })}
                placeholder="7990.00"
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
      <div className={`p-5 rounded-none border transition-all space-y-4 ${
        hasLivePrice
          ? 'bg-rose-50/70 border-rose-300'
          : 'bg-[#fcfaf7]/60 border-dashed border-[#ded6c7]'
      }`}>
        <div className="flex items-center justify-between border-b border-[#e2d5c3] pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-none ${hasLivePrice ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-[#ded6c7] text-[#5c4a3b]'}`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#17100b] text-sm">Preço Live / Promocional</h4>
              <p className="text-xs text-[#736557]">Exibido quando o Modo Live está ativo</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasLivePrice}
              onChange={e => handleToggleLivePrice(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-[#ded6c7] peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-700"></div>
          </label>
        </div>

        {hasLivePrice ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Preço À Vista Promocional (R$):</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-rose-400 text-sm font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={livePrice?.price || ''}
                  onChange={e => onLivePriceChange({ ...livePrice!, price: parseFloat(e.target.value) || 0 })}
                  placeholder="6990.00"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-bold text-rose-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Parcelamento Promocional:</label>
              <input
                type="text"
                value={livePrice?.installments || ''}
                onChange={e => onLivePriceChange({ ...livePrice!, installments: e.target.value })}
                placeholder="ex: 10x de R$ 799,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Preço Antigo / De (Opcional):</label>
              <input
                type="text"
                value={livePrice?.oldPrice || ''}
                onChange={e => onLivePriceChange({ ...livePrice!, oldPrice: e.target.value || undefined })}
                placeholder="ex: De R$ 7.990,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none text-[#736557]"
              />
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs font-bold text-[#736557]">Preço Live não definido.</p>
            <p className="text-[11px] text-[#9c8b79] mt-1">Quando desativado, o produto continuará usando o preço normal mesmo durante a Live.</p>
          </div>
        )}
      </div>
    </div>
  );
}
