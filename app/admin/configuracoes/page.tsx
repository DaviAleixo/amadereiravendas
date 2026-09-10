'use client';

import React, { useEffect, useState } from 'react';
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
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando configurações gerais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Settings Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-900 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Configurações Gerais do Catálogo</h2>
            <p className="text-xs text-stone-500">Parâmetros operacionais e integração do atendimento.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Título do Painel / Loja: *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={catalogTitle}
                onChange={e => setCatalogTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Número do WhatsApp Comercial: *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="5511999999999"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-stone-900"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Inclua o código do país (55) e DDD. Este número é usado nos botões "Tenho Interesse" e "Falar pelo WhatsApp".
            </p>
          </div>

          {/* Database & Architecture Note Card */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 pt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Database className="w-4 h-4 text-amber-900" />
              <span>Preparação para Conexão com o Supabase</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              O painel está operando na camada de abstração de serviços. Quando o Supabase for conectado na próxima etapa, todos os serviços (`productService`, `categoryService`, `settingsService`, `userService`) utilizarão os clientes `supabase-js` transparentemente.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
