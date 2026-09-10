'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Sparkles, Save, Power } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { productService } from '@/services/productService';
import { CatalogSettings } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';

export default function LivePage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<CatalogSettings | null>(null);
  const [liveProductsCount, setLiveProductsCount] = useState(0);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State for Banner
  const [showBanner, setShowBanner] = useState(true);
  const [bannerText, setBannerText] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [sets, prods] = await Promise.all([
        settingsService.getSettings(),
        productService.getAll()
      ]);
      setSettings(sets);
      setShowBanner(sets.showPromotionBanner);
      setBannerText(sets.promotionBannerText);

      const liveProds = prods.filter(p => p.livePrice && p.livePrice.price > 0);
      setLiveProductsCount(liveProds.length);
      setTotalProductsCount(prods.length);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleLiveMode = async () => {
    if (!settings) return;
    const newStatus = await settingsService.toggleLiveMode();
    setSettings(prev => (prev ? { ...prev, liveMode: newStatus } : null));

    showToast(
      newStatus ? '🔴 MODO LIVE ATIVADO!' : 'Modo Live Desativado',
      newStatus
        ? 'Os preços promocionais da Live agora estão visíveis no site.'
        : 'O catálogo voltou aos preços normais de tabela.',
      newStatus ? 'success' : 'info'
    );
  };

  const handleSaveBannerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated = await settingsService.updateSettings({
      showPromotionBanner: showBanner,
      promotionBannerText: bannerText
    });

    setSettings(updated);
    setSaving(false);

    showToast('Configurações do Banner Salvas', 'O texto da transmissão promocional foi atualizado.', 'success');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#8c5b2b] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando configurações do Modo Live...</p>
        </div>
      </div>
    );
  }

  const isLive = settings.liveMode;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Compact Modern Live Mode Hero Card */}
      <div className={`rounded-3xl p-5 sm:p-6 border shadow-lg transition-all relative overflow-hidden ${
        isLive
          ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-stone-950 text-white border-rose-600/50 shadow-rose-950/30'
          : 'bg-white text-[#1c1511] border-[#e7e0d5] shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                isLive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 animate-pulse'
                  : 'bg-[#fcf6eb] text-[#8c5b2b] border border-[#ebdcc9]'
              }`}>
                <Radio className="w-3.5 h-3.5" />
                {isLive ? '🔴 MODO PROMOCIONAL ATIVADO' : '○ MODO LIVE DESATIVADO'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {isLive ? 'Sua Live Shop está no Ar!' : 'Controle do Modo Live'}
            </h2>

            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              isLive ? 'bg-rose-900/60 border border-rose-500/40 text-rose-200' : 'bg-[#fdfbf7] border border-[#f0e9dd] text-[#3b2d23]'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{liveProductsCount} de {totalProductsCount} produtos</strong> possuem preço promocional.
              </span>
            </div>
          </div>

          {/* Compact Tactile Toggle Control Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all shrink-0 flex flex-col items-center justify-center min-w-[190px] ${
            isLive
              ? 'bg-rose-950/80 border-rose-500/50 shadow-lg backdrop-blur-md'
              : 'bg-[#f7f2ea] border-[#e2d6c3]'
          }`}>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest mb-2.5 ${
              isLive ? 'text-rose-200' : 'text-[#736557]'
            }`}>
              Status da Transmissão
            </span>

            <button
              onClick={handleToggleLiveMode}
              type="button"
              className={`relative inline-flex items-center h-12 w-24 rounded-full p-1 transition-all duration-300 focus:outline-none border shadow-inner group ${
                isLive
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 border-rose-400/80 shadow-rose-900/50'
                  : 'bg-[#e5dcd0] border-[#cebfab]'
              }`}
              title={isLive ? 'Clique para desativar Modo Live' : 'Clique para ativar Modo Live'}
            >
              {/* Background Track Text Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-black uppercase tracking-wider select-none pointer-events-none">
                <span className={`transition-opacity duration-200 ${isLive ? 'opacity-0' : 'opacity-70 text-[#5c4a3b]'}`}>
                  OFF
                </span>
                <span className={`transition-opacity duration-200 ${isLive ? 'opacity-90 text-white' : 'opacity-0'}`}>
                  ON
                </span>
              </div>

              {/* Sliding Knob */}
              <span
                className={`relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md transform transition-all duration-300 ease-in-out ${
                  isLive
                    ? 'translate-x-12 text-rose-600 shadow-rose-900/30'
                    : 'translate-x-0 text-stone-400 shadow-stone-400/20'
                }`}
              >
                <Power className={`w-4 h-4 transition-transform group-hover:scale-110 ${isLive ? 'text-rose-600' : 'text-[#736557]'}`} />
              </span>
            </button>

            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-ping' : 'bg-[#9c8977]'}`} />
              <span className={`text-[11px] font-extrabold ${isLive ? 'text-rose-200' : 'text-[#5c4a3b]'}`}>
                {isLive ? 'AO VIVO' : 'Desativado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Configuration Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#e7e0d5] shadow-sm space-y-5">
        <div className="border-b border-[#f2ece3] pb-3.5">
          <h3 className="font-extrabold text-[#1c1511] text-base sm:text-lg">Texto do Banner Promocional</h3>
          <p className="text-xs text-[#736557]">Personalize a mensagem exibida na faixa superior do site público.</p>
        </div>

        {/* Live Banner Real-time Preview */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-[#736557] uppercase tracking-wider">
            Preview do Banner em Tempo Real:
          </label>
          <div className="relative rounded-2xl overflow-hidden border border-[#c8a97e]/60 shadow-sm">
            <div
              style={{ background: '#c8a97e', color: '#1a1a1a' }}
              className="text-center py-3.5 px-4 text-xs font-bold uppercase tracking-widest"
            >
              <span>{bannerText || '🔴 Catálogo Especial — Live Shop'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBannerSettings} className="space-y-4 pt-1">
          {/* Banner Visibility */}
          <div className="flex items-center justify-between p-4 bg-[#fdfbf7] rounded-2xl border border-[#f0e9dd]">
            <div>
              <p className="text-xs font-bold text-[#1c1511]">Exibir Banner Promocional no Topo do Site</p>
              <p className="text-[11px] text-[#736557]">Mostra a barra de aviso em destaque acima do menu.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBanner}
                onChange={e => setShowBanner(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8c5b2b]"></div>
            </label>
          </div>

          {/* Banner Text */}
          <div>
            <label className="block text-xs font-bold text-[#1c1511] mb-1">Texto do Banner: *</label>
            <input
              type="text"
              required
              value={bannerText}
              onChange={e => setBannerText(e.target.value)}
              placeholder="ex: 🔴 Catálogo Especial — Live Shop 22/Ago"
              className="w-full px-3.5 py-3 text-sm bg-[#fdfbf7] border border-[#e7e0d5] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none font-semibold text-[#1c1511]"
            />
          </div>

          {/* Centered Save Button on Mobile */}
          <div className="flex justify-center sm:justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#8c5b2b]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações do Banner'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
