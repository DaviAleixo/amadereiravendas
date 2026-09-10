'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Sparkles, Eye, Save, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { productService } from '@/services/productService';
import { CatalogSettings, Product } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { formatCurrency } from '@/lib/currency';

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
  const [buttonText, setButtonText] = useState('');
  const [link, setLink] = useState('');

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
      setButtonText(sets.promotionButtonText);
      setLink(sets.promotionLink);

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
        ? 'Os preços promocionais e ofertas da Live agora estão visíveis aos clientes.'
        : 'O catálogo voltou imediatamente aos preços normais de tabela.',
      newStatus ? 'success' : 'info'
    );
  };

  const handleSaveBannerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated = await settingsService.updateSettings({
      showPromotionBanner: showBanner,
      promotionBannerText: bannerText,
      promotionButtonText: buttonText,
      promotionLink: link
    });

    setSettings(updated);
    setSaving(false);

    showToast('Configurações da Live Salvas', 'O banner e o texto da transmissão foram atualizados.', 'success');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando configurações do Modo Live...</p>
        </div>
      </div>
    );
  }

  const isLive = settings.liveMode;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Featured Big Switch Hero Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all relative overflow-hidden ${
        isLive
          ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-stone-950 text-white border-rose-600/50 shadow-rose-950/30'
          : 'bg-white text-stone-900 border-stone-200 shadow-stone-200/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                isLive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
                  : 'bg-stone-100 text-stone-600 border border-stone-200'
              }`}>
                <Radio className="w-3.5 h-3.5" />
                {isLive ? '🔴 MODO PROMOCIONAL ATIVADO' : '○ MODO LIVE DESATIVADO'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isLive ? 'Sua Live Shop está no Ar!' : 'Controle do Modo Live Promocional'}
            </h2>

            <p className={`text-sm leading-relaxed ${isLive ? 'text-rose-100' : 'text-stone-600'}`}>
              {isLive
                ? 'Os preços promocionais especiais cadastrados nas peças estão ATIVOS no site público neste momento.'
                : 'Os preços normais de tabela estão sendo exibidos no catálogo. Clique no switch ao lado para ativar as ofertas da Live.'}
            </p>

            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              isLive ? 'bg-rose-900/60 border border-rose-500/40 text-rose-200' : 'bg-stone-50 border border-stone-200 text-stone-700'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{liveProductsCount} de {totalProductsCount} produtos</strong> possuem preço promocional cadastrado.
              </span>
            </div>
          </div>

          {/* Big Toggle Button */}
          <div className="flex flex-col items-center justify-center p-6 bg-stone-900/20 backdrop-blur-md rounded-3xl border border-white/10 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">Alternar Modo</span>
            <button
              onClick={handleToggleLiveMode}
              className={`relative inline-flex items-center h-12 rounded-full w-24 transition-colors focus:outline-none p-1 border-2 shadow-inner ${
                isLive ? 'bg-rose-600 border-rose-400' : 'bg-stone-300 border-stone-400'
              }`}
              title={isLive ? 'Clique para desativar Modo Live' : 'Clique para ativar Modo Live'}
            >
              <span
                className={`inline-block w-10 h-10 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center font-bold text-xs ${
                  isLive ? 'translate-x-11 text-rose-700' : 'translate-x-0 text-stone-600'
                }`}
              >
                {isLive ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="text-[11px] font-bold mt-2">
              {isLive ? 'Clique p/ Desativar' : 'Clique p/ Ativar'}
            </span>
          </div>
        </div>
      </div>

      {/* Banner Configuration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <h3 className="font-bold text-stone-900 text-lg">Configuração do Banner de Topo</h3>
          <p className="text-xs text-stone-500">Personalize o aviso que aparece na faixa superior do site durante o evento.</p>
        </div>

        {/* Live Banner Real-time Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
            Preview do Banner em Tempo Real:
          </label>
          <div className="relative rounded-2xl overflow-hidden border border-amber-300/80 shadow-md">
            <div
              style={{ background: '#c8a97e', color: '#1a1a1a' }}
              className="text-center py-3 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <span>{bannerText || '🔴 Catálogo Especial — Live Shop'}</span>
              {buttonText && (
                <span className="hidden sm:inline-block underline text-[10px] bg-black/10 px-2.5 py-0.5 rounded-full">
                  {buttonText} →
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBannerSettings} className="space-y-4 pt-2">
          {/* Banner Visibility */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <p className="text-xs font-bold text-stone-900">Exibir Banner Promocional no Topo do Site</p>
              <p className="text-[11px] text-stone-500">Mostra a barra de aviso em destaque acima do menu inicial do site público.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBanner}
                onChange={e => setShowBanner(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
            </label>
          </div>

          {/* Banner Text */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Texto do Banner:</label>
            <input
              type="text"
              required
              value={bannerText}
              onChange={e => setBannerText(e.target.value)}
              placeholder="ex: 🔴 Catálogo Especial — Live Shop 22/Ago"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Button Text */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">Texto do Botão / Chamada:</label>
              <input
                type="text"
                value={buttonText}
                onChange={e => setButtonText(e.target.value)}
                placeholder="ex: Ver Peças em Destaque"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">Link de Destino:</label>
              <input
                type="text"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="ex: #produtos ou https://..."
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando Banner...' : 'Salvar Alterações do Banner'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
