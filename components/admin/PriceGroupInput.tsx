'use client';

import React from 'react';
import { Tag, Radio, Zap, Check, Plus, Trash2, Calculator } from 'lucide-react';
import { PriceGroup } from '@/data/mockAdminData';
import { motion } from 'motion/react';
import { CurrencyInput } from './CurrencyInput';
import { formatCurrency } from '@/lib/currency';

type PriceGroupInputProps = {
  normalPrice: PriceGroup;
  livePrice?: PriceGroup;
  onNormalPriceChange: (val: PriceGroup) => void;
  onLivePriceChange: (val?: PriceGroup) => void;
};

export function PriceGroupInput({
  normalPrice,
  livePrice,
  onNormalPriceChange,
  onLivePriceChange
}: PriceGroupInputProps) {
  // Ativo se livePrice for um objeto
  const isLiveEnabled = livePrice !== undefined && livePrice !== null;

  const toggleLivePrice = () => {
    if (isLiveEnabled) {
      onLivePriceChange(undefined);
    } else {
      // Sugere 10% de desconto sobre o preço normal ou valores padrão
      const discountPrice = normalPrice.price ? Math.round(normalPrice.price * 0.9) : 0;
      const installmentsStr = discountPrice > 0
        ? `10x de ${formatCurrency(discountPrice / 10)}`
        : (normalPrice.installments || '');
      const oldPriceStr = normalPrice.price > 0
        ? formatCurrency(normalPrice.price)
        : undefined;

      onLivePriceChange({
        price: discountPrice,
        installments: installmentsStr,
        oldPrice: oldPriceStr
      });
    }
  };

  // Helpers para geração rápida de parcelamento
  const applyNormalInstallments = (times: number, interest = 1) => {
    if (normalPrice.price <= 0) return;
    const total = normalPrice.price * interest;
    const installmentValue = total / times;
    const text = `${times}x de ${formatCurrency(installmentValue)}`;
    onNormalPriceChange({ ...normalPrice, installments: text });
  };

  const applyLiveInstallments = (times: number, interest = 1) => {
    if (!livePrice || livePrice.price <= 0) return;
    const total = livePrice.price * interest;
    const installmentValue = total / times;
    const text = `${times}x de ${formatCurrency(installmentValue)}`;
    onLivePriceChange({
      ...livePrice,
      installments: text
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Bloco 1: PREÇO NORMAL */}
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

        <div className="space-y-4">
          {/* Preço À Vista */}
          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1.5">
              Preço À Vista: *
            </label>
            <CurrencyInput
              value={normalPrice.price}
              onChange={val => {
                const updated: PriceGroup = { ...normalPrice, price: val };
                // Se o campo de parcelamento estiver vazio e preencheu preço, sugere 10x sem juros
                if (!normalPrice.installments && val > 0) {
                  updated.installments = `10x de ${formatCurrency(val / 10)}`;
                }
                onNormalPriceChange(updated);
              }}
              required
              placeholder="0,00"
              variant="normal"
            />
            <p className="text-[10px] text-stone-500 mt-1">Digite apenas os números, a máscara formata automaticamente em R$.</p>
          </div>

          {/* Parcelamento Comercial */}
          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1.5">
              Parcelamento Comercial: *
            </label>
            <input
              type="text"
              required
              value={normalPrice.installments || ''}
              onChange={e => onNormalPriceChange({ ...normalPrice, installments: e.target.value })}
              placeholder="ex: 10x de R$ 899,00 ou R$ 12.990,00 em 10x"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium text-[#17100b]"
            />

            {/* Chips organizados em grid responsivo para preenchimento de parcelas */}
            {normalPrice.price > 0 && (
              <div className="mt-2.5 p-2.5 bg-white border border-[#ded6c7] rounded-none space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#736557]">
                  <span className="flex items-center gap-1.5 text-[#8c5b2b]">
                    <Calculator className="w-3.5 h-3.5" /> Sugestões de Parcelas:
                  </span>
                  <span className="text-[9px] text-stone-400 font-normal lowercase">1 clique p/ aplicar</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => applyNormalInstallments(10, 1)}
                    className={`px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                      normalPrice.installments === `10x de ${formatCurrency(normalPrice.price / 10)}`
                        ? 'bg-[#8c5b2b] text-white border-[#8c5b2b] shadow-2xs'
                        : 'bg-[#fcfaf7] hover:bg-[#f5ebd6] text-[#3b2d23] border-[#ded6c7]'
                    }`}
                  >
                    <span className="block text-[9px] font-extrabold uppercase opacity-75">10x s/ juros</span>
                    <span className="block truncate">{formatCurrency(normalPrice.price / 10)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyNormalInstallments(12, 1)}
                    className={`px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                      normalPrice.installments === `12x de ${formatCurrency(normalPrice.price / 12)}`
                        ? 'bg-[#8c5b2b] text-white border-[#8c5b2b] shadow-2xs'
                        : 'bg-[#fcfaf7] hover:bg-[#f5ebd6] text-[#3b2d23] border-[#ded6c7]'
                    }`}
                  >
                    <span className="block text-[9px] font-extrabold uppercase opacity-75">12x s/ juros</span>
                    <span className="block truncate">{formatCurrency(normalPrice.price / 12)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyNormalInstallments(10, 1.1)}
                    className={`col-span-2 sm:col-span-1 px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                      normalPrice.installments === `10x de ${formatCurrency((normalPrice.price * 1.1) / 10)}`
                        ? 'bg-[#8c5b2b] text-white border-[#8c5b2b] shadow-2xs'
                        : 'bg-[#fcfaf7] hover:bg-[#f5ebd6] text-[#736557] border-[#ded6c7]'
                    }`}
                  >
                    <span className="block text-[9px] font-extrabold uppercase opacity-75">10x c/ 10%</span>
                    <span className="block truncate">{formatCurrency((normalPrice.price * 1.1) / 10)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preço Antigo / De (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1.5">
              Preço Antigo / "De" (Opcional):
            </label>
            <CurrencyInput
              value={normalPrice.oldPrice}
              onChangeString={val => onNormalPriceChange({ ...normalPrice, oldPrice: val })}
              allowEmpty
              placeholder="0,00 (Sem preço de referência)"
              variant="normal"
            />
            <p className="text-[10px] text-stone-500 mt-1">
              Deixe em branco se a peça não tiver desconto ou preço de tabela anterior.
            </p>
          </div>
        </div>
      </div>

      {/* Bloco 2: PREÇO LIVE / PROMOCIONAL */}
      <div
        className={`p-5 rounded-none border transition-all space-y-4 shadow-sm ${
          isLiveEnabled
            ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300/60'
            : 'bg-[#fcfaf7]/70 border-dashed border-[#ded6c7]'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#e2d5c3] pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-none transition-colors ${
                isLiveEnabled ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-[#ded6c7] text-[#5c4a3b]'
              }`}
            >
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

          {/* Botão Master Switch Live */}
          <motion.button
            type="button"
            onClick={toggleLivePrice}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center h-7 w-14 rounded-none p-0.5 transition-colors cursor-pointer border ${
              isLiveEnabled ? 'bg-rose-700 border-rose-800' : 'bg-stone-300 border-stone-400'
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
          <div className="space-y-4">
            {/* Preço À Vista da Live */}
            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1.5">
                Preço À Vista da Live: *
              </label>
              <CurrencyInput
                value={livePrice?.price}
                onChange={val => {
                  const updated: PriceGroup = {
                    price: val,
                    installments: livePrice?.installments || '',
                    oldPrice: livePrice?.oldPrice
                  };
                  if (!livePrice?.installments && val > 0) {
                    updated.installments = `10x de ${formatCurrency(val / 10)}`;
                  }
                  onLivePriceChange(updated);
                }}
                required
                placeholder="0,00"
                variant="live"
              />
              <p className="text-[10px] text-rose-700/80 mt-1">
                Valor especial com desconto ofertado na transmissão ao vivo.
              </p>
            </div>

            {/* Parcelamento Promocional na Live */}
            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1.5">
                Parcelamento Promocional na Live: *
              </label>
              <input
                type="text"
                required
                value={livePrice?.installments || ''}
                onChange={e =>
                  onLivePriceChange({
                    price: livePrice?.price || 0,
                    installments: e.target.value,
                    oldPrice: livePrice?.oldPrice
                  })
                }
                placeholder="ex: 10x de R$ 799,00"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-rose-300 rounded-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-medium text-rose-950"
              />

              {/* Chips organizados em grid responsivo para preenchimento de parcelas Live */}
              {livePrice && livePrice.price > 0 && (
                <div className="mt-2.5 p-2.5 bg-white border border-rose-200 rounded-none space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    <span className="flex items-center gap-1.5 text-rose-700">
                      <Calculator className="w-3.5 h-3.5" /> Sugestões Live:
                    </span>
                    <span className="text-[9px] text-rose-400 font-normal lowercase">1 clique p/ aplicar</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => applyLiveInstallments(10, 1)}
                      className={`px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                        livePrice.installments === `10x de ${formatCurrency(livePrice.price / 10)}`
                          ? 'bg-rose-700 text-white border-rose-800 shadow-2xs'
                          : 'bg-rose-50/70 hover:bg-rose-100 text-rose-900 border-rose-200'
                      }`}
                    >
                      <span className="block text-[9px] font-extrabold uppercase opacity-80">10x s/ juros</span>
                      <span className="block truncate">{formatCurrency(livePrice.price / 10)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyLiveInstallments(12, 1)}
                      className={`px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                        livePrice.installments === `12x de ${formatCurrency(livePrice.price / 12)}`
                          ? 'bg-rose-700 text-white border-rose-800 shadow-2xs'
                          : 'bg-rose-50/70 hover:bg-rose-100 text-rose-900 border-rose-200'
                      }`}
                    >
                      <span className="block text-[9px] font-extrabold uppercase opacity-80">12x s/ juros</span>
                      <span className="block truncate">{formatCurrency(livePrice.price / 12)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyLiveInstallments(6, 1)}
                      className={`col-span-2 sm:col-span-1 px-2 py-1.5 text-center rounded-none border text-[11px] font-bold transition-all cursor-pointer ${
                        livePrice.installments === `6x de ${formatCurrency(livePrice.price / 6)}`
                          ? 'bg-rose-700 text-white border-rose-800 shadow-2xs'
                          : 'bg-rose-50/70 hover:bg-rose-100 text-rose-900 border-rose-200'
                      }`}
                    >
                      <span className="block text-[9px] font-extrabold uppercase opacity-80">6x s/ juros</span>
                      <span className="block truncate">{formatCurrency(livePrice.price / 6)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preço de Referência Antigo / "De" da Live (Opcional) */}
            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1.5">
                Preço de Referência Antigo / "De" na Live (Opcional):
              </label>
              <CurrencyInput
                value={livePrice?.oldPrice}
                onChangeString={val =>
                  onLivePriceChange({
                    price: livePrice?.price || 0,
                    installments: livePrice?.installments || '',
                    oldPrice: val
                  })
                }
                allowEmpty
                placeholder="0,00 (Ex: Preço de tabela anterior)"
                variant="live"
              />
              <p className="text-[10px] text-rose-700/80 mt-1">
                Geralmente o preço de tabela original antes do desconto da Live.
              </p>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={toggleLivePrice}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 transition-colors cursor-pointer"
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
