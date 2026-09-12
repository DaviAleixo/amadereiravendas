'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Phone, Building, Info, Database } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { CatalogSettings } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<CatalogSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [catalogTitle, setCatalogTitle] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setCatalogTitle(data.catalogTitle);
      setWhatsappNumber(data.whatsappNumber);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated = await settingsService.updateSettings({
      catalogTitle,
      whatsappNumber
    });

    setSettings(updated);
    setSaving(false);
    showToast('Configurações Salvas', 'As informações gerais do catálogo foram atualizadas.', 'success');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-[2px] animate-spin" />
          <p className="text-xs text-stone-500 font-medium tracking-wide">Carregando configurações gerais...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Settings Card */}
      <div className="admin-card-luxury p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200/80 pb-5 flex items-center gap-3.5">
          <div className="p-2.5 bg-[#18110b] text-[#c8a97e] rounded-none border border-[#3d2719]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">Configurações Gerais do Catálogo</h2>
            <p className="text-xs text-stone-500">Parâmetros operacionais e integração do atendimento.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Título do Painel / Loja: *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={catalogTitle}
                onChange={e => setCatalogTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-none focus:ring-2 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-semibold text-stone-900 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Número do WhatsApp Comercial: *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="5519984153232"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-none focus:ring-2 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-mono text-stone-900 shadow-sm transition-all"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              Inclua o código do país (55) e DDD. Este número é usado automaticamente em todos os botões "Tenho Interesse" e "Falar pelo WhatsApp" da LP de vendas.
            </p>
          </div>

          {/* Database & Architecture Note Card */}
          <div className="p-4 bg-stone-50 rounded-none border border-stone-200 space-y-2 pt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <Database className="w-4 h-4 text-amber-800" />
              <span>Preparação para Conexão com o Supabase</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              O painel está operando na camada de abstração de serviços. Quando o Supabase for conectado na próxima etapa, todos os serviços (`productService`, `categoryService`, `settingsService`, `userService`) utilizarão os clientes `supabase-js` transparentemente.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#18110b] hover:bg-[#25170f] text-[#c8a97e] hover:text-white font-bold text-xs uppercase tracking-wider rounded-none border border-[#3d2719] shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
