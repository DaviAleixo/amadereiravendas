'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Save, Power, Activity, Eye, Tag, Zap, Flame } from 'lucide-react';
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
      newStatus ? 'TRANSMISSÃO AO VIVO ATIVADA!' : 'Modo Live Desativado',
      newStatus
        ? 'Os preços promocionais da Live estão ATIVOS no site público.'
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

    showToast('Configurações Salvas', 'O banner da transmissão promocional foi atualizado.', 'success');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Carregando painel de transmissão...</p>
        </div>
      </div>
    );
  }

  const isLive = settings.liveMode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Aceternity-Inspired Glowing Pink Luxury Live Broadcast Hero */}
      <div className="relative rounded-none overflow-hidden group">
        
        {/* Animated Pink Aurora Glow Background (Motion) */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 rounded-none opacity-40 blur-xl transition-all duration-1000 group-hover:opacity-75" />
        
        <motion.div
          layout
          className="rounded-none relative overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.15)] transition-all border"
          style={{
            backgroundColor: '#0c0608',
            borderColor: isLive ? 'rgba(244, 63, 94, 0.5)' : 'rgba(236, 72, 153, 0.25)'
          }}
        >
          {/* Animated Background Motion Glowing Blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Glowing Pink Aurora Orb 1 */}
            <motion.div
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.2, 0.95, 1],
                opacity: isLive ? [0.45, 0.75, 0.5, 0.45] : [0.2, 0.35, 0.2]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -top-24 -left-20 w-96 h-96 bg-gradient-to-br from-pink-600/50 via-fuchsia-600/30 to-transparent rounded-full blur-[70px]"
            />

            {/* Glowing Pink Aurora Orb 2 */}
            <motion.div
              animate={{
                x: [0, -50, 30, 0],
                y: [0, 40, -30, 0],
                scale: [1, 1.25, 1],
                opacity: isLive ? [0.4, 0.7, 0.4] : [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute -bottom-24 -right-20 w-96 h-96 bg-gradient-to-tl from-rose-500/50 via-pink-500/35 to-transparent rounded-full blur-[80px]"
            />

            {/* Glowing Center Radial Beam */}
            <motion.div
              animate={{
                opacity: isLive ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18)_0%,transparent_70%)]"
            />

            {/* Subtle Tech Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          </div>

          <div className="p-6 sm:p-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left Column: Live Status & Info */}
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Glowing Pink Live Status Pill */}
                  <motion.div
                    layout
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-none text-xs font-black uppercase tracking-wider border shadow-lg transition-all ${
                      isLive
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white border-pink-400/90 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                        : 'bg-white/5 text-stone-300 border-pink-500/20 shadow-none'
                    }`}
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      {isLive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-200 opacity-80" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-stone-500'}`} />
                    </span>
                    <Radio className="w-3.5 h-3.5" />
                    <span>{isLive ? 'AO VIVO • MODO PROMOCIONAL ATIVO' : 'MODO LIVE DESATIVADO'}</span>
                  </motion.div>

                  {/* Equalizer Wave Bars */}
                  {isLive && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-950/40 rounded-none border border-pink-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                      <Activity className="w-3.5 h-3.5 text-pink-400" />
                      <div className="flex items-end gap-0.5 h-3">
                        {[0.3, 0.8, 0.5, 1, 0.4, 0.7].map((delay, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: ['20%', '100%', '30%'] }}
                            transition={{
                              duration: 0.75,
                              repeat: Infinity,
                              delay: delay * 0.18,
                              ease: 'easeInOut'
                            }}
                            className="w-1 bg-gradient-to-t from-pink-500 to-rose-300 rounded-none"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Headline */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                    {isLive ? 'Sua Live Shop está no Ar!' : 'Controle da Transmissão Live'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 font-normal mt-1.5 leading-relaxed">
                    {isLive
                      ? 'O catálogo público está com os preços promocionais visíveis e o banner em destaque máximo.'
                      : 'O site está operando com os preços normais de tabela. Clique no switch para ativar as ofertas da Live.'}
                  </p>
                </div>

                {/* Clean Luxury Stats Card (No star emojis) */}
                <div className={`p-3.5 rounded-none text-xs font-semibold flex items-center gap-3 border transition-colors ${
                  isLive
                    ? 'bg-pink-950/30 border-pink-500/30 text-pink-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                    : 'bg-white/5 border-white/10 text-stone-300'
                }`}>
                  <Tag className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>
                    <strong className="text-pink-300 font-bold">{liveProductsCount} de {totalProductsCount} produtos</strong> possuem preço promocional cadastrado.
                  </span>
                </div>
              </div>

              {/* Right Column: Studio Control Switch Module */}
              <div className="flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-xl rounded-none border border-pink-500/30 min-w-[220px] shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-300/80 mb-3.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-pink-400" />
                  Interruptor Principal
                </span>

                {/* Master Switch Button */}
                <motion.button
                  onClick={handleToggleLiveMode}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative inline-flex items-center h-14 w-32 rounded-none p-1.5 transition-all duration-300 focus:outline-none border-2 shadow-2xl cursor-pointer ${
                    isLive
                      ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 border-pink-300 shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                      : 'bg-stone-800 border-stone-600 shadow-stone-950/60'
                  }`}
                  title={isLive ? 'Clique para desligar Modo Live' : 'Clique para ligar Modo Live'}
                >
                  {/* Labels Inside Track */}
                  <div className="absolute inset-0 flex items-center justify-between px-3.5 text-[10px] font-black uppercase tracking-wider select-none pointer-events-none">
                    <span className={`transition-opacity duration-200 ${isLive ? 'opacity-0' : 'opacity-70 text-stone-400'}`}>
                      OFF
                    </span>
                    <span className={`transition-opacity duration-200 ${isLive ? 'opacity-100 text-white drop-shadow-md' : 'opacity-0'}`}>
                      LIVE
                    </span>
                  </div>

                  {/* Sliding Knob with Spring Motion */}
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={`relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-none bg-white shadow-2xl font-black text-xs ${
                      isLive ? 'ml-auto text-pink-600' : 'mr-auto text-stone-700'
                    }`}
                  >
                    <Power className={`w-5 h-5 transition-transform ${isLive ? 'text-pink-600' : 'text-stone-700'}`} />
                  </motion.div>
                </motion.button>

                {/* Status Indicator */}
                <div className="mt-3.5 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-none ${isLive ? 'bg-pink-500 animate-ping' : 'bg-stone-600'}`} />
                  <span className={`text-xs font-black uppercase tracking-wider ${isLive ? 'text-pink-400' : 'text-stone-400'}`}>
                    {isLive ? 'TRANSMISSÃO ATIVA' : 'DESLIGADO'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Banner Configuration Card */}
      <div className="bg-white rounded-none p-6 sm:p-8 border border-[#ece4d8] shadow-sm space-y-6">
        <div className="border-b border-[#f0e9dd] pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#8c5b2b]" />
              Configuração do Banner de Topo
            </h3>
            <p className="text-xs text-[#736557]">Mensagem exibida na faixa superior do site durante a transmissão.</p>
          </div>
        </div>

        {/* Live Banner Real-time Preview */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold text-[#736557] uppercase tracking-wider">
            Preview em Tempo Real no Site:
          </label>
          <div className="relative rounded-none overflow-hidden border border-[#c8a97e] shadow-sm">
            <div
              style={{ background: '#c8a97e', color: '#1a1a1a' }}
              className="text-center py-3.5 px-4 text-xs font-bold uppercase tracking-widest shadow-inner"
            >
              <span>{bannerText || 'Catálogo Especial — Live Shop'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBannerSettings} className="space-y-5 pt-1">
          {/* Banner Visibility */}
          <div className="flex items-center justify-between p-4 bg-[#f8f4ee] rounded-none border border-[#ece4d8]">
            <div>
              <p className="text-xs font-bold text-[#17100b]">Exibir Banner Promocional no Topo do Site</p>
              <p className="text-[11px] text-[#736557]">Mostra a barra dourada de aviso acima do menu principal.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBanner}
                onChange={e => setShowBanner(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8c5b2b]"></div>
            </label>
          </div>

          {/* Banner Text */}
          <div>
            <label className="block text-xs font-bold text-[#5c4a3b] mb-1.5">Texto do Banner: *</label>
            <input
              type="text"
              required
              value={bannerText}
              onChange={e => setBannerText(e.target.value)}
              placeholder="ex: Catálogo Especial — Live Shop 22/Ago"
              className="w-full px-4 py-3 text-sm bg-white border border-[#ded6c7] rounded-none focus:ring-2 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b] shadow-sm transition-all"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-md transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações do Banner'}</span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
