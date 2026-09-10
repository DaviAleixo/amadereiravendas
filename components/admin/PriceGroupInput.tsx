'use client';

import React from 'react';
import { DollarSign, Tag, Radio } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Block 1: PREÇO NORMAL */}
      <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Preço Normal (Catálogo Regular)</h4>
            <p className="text-xs text-stone-500">Valores padrão exibidos no site</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Preço À Vista (R$): *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 text-sm font-semibold">R$</span>
              <input
                type="number"
                step="0.01"
                required
                value={normalPrice.price || ''}
                onChange={e => onNormalPriceChange({ ...normalPrice, price: parseFloat(e.target.value) || 0 })}
                placeholder="7990.00"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Parcelamento Comercial: *</label>
            <input
              type="text"
              required
              value={normalPrice.installments || ''}
              onChange={e => onNormalPriceChange({ ...normalPrice, installments: e.target.value })}
              placeholder="ex: 10x de R$ 899,00 ou R$ 12.990,00 em 10x"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Preço Antigo / De (Opcional):</label>
            <input
              type="text"
              value={normalPrice.oldPrice || ''}
              onChange={e => onNormalPriceChange({ ...normalPrice, oldPrice: e.target.value || undefined })}
              placeholder="ex: R$ 24.990,00"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-stone-600"
            />
          </div>
        </div>
      </div>

      {/* Block 2: PREÇO LIVE / PROMOCIONAL */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
        hasLivePrice
          ? 'bg-rose-50/50 border-rose-200'
          : 'bg-stone-50/40 border-dashed border-stone-300 opacity-90'
      }`}>
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${hasLivePrice ? 'bg-rose-100 text-rose-700' : 'bg-stone-200 text-stone-600'}`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Preço Live / Promocional</h4>
              <p className="text-xs text-stone-500">Exibido quando o Modo Live está ativo</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasLivePrice}
              onChange={e => handleToggleLivePrice(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {hasLivePrice ? (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Preço À Vista Promocional (R$):</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-rose-400 text-sm font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={livePrice?.price || ''}
                  onChange={e => onLivePriceChange({ ...livePrice!, price: parseFloat(e.target.value) || 0 })}
                  placeholder="6990.00"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-rose-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Parcelamento Promocional:</label>
              <input
                type="text"
                value={livePrice?.installments || ''}
                onChange={e => onLivePriceChange({ ...livePrice!, installments: e.target.value })}
                placeholder="ex: 10x de R$ 799,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">Preço Antigo / De (Opcional):</label>
              <input
                type="text"
                value={livePrice?.oldPrice || ''}
                onChange={e => onLivePriceChange({ ...livePrice!, oldPrice: e.target.value || undefined })}
                placeholder="ex: De R$ 7.990,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-stone-600"
              />
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs font-semibold text-stone-500">Preço Live não definido.</p>
            <p className="text-[11px] text-stone-400 mt-1">Quando desativado, o produto continuará usando o preço normal mesmo durante a Live.</p>
          </div>
        )}
      </div>
    </div>
  );
}
