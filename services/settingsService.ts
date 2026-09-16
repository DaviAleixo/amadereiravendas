import { CatalogSettings, INITIAL_SETTINGS } from '@/data/mockAdminData';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'amadeireira_admin_settings_v2';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache

function mapFromSupabase(row: any): CatalogSettings {
  return {
    liveMode: row.live_mode ?? false,
    showPromotionBanner: row.show_promotion_banner ?? true,
    promotionBannerText: row.promotion_banner_text ?? INITIAL_SETTINGS.promotionBannerText,
    promotionButtonText: row.promotion_button_text ?? INITIAL_SETTINGS.promotionButtonText,
    promotionLink: row.promotion_link ?? INITIAL_SETTINGS.promotionLink,
    catalogTitle: row.catalog_title ?? INITIAL_SETTINGS.catalogTitle,
    whatsappNumber: row.whatsapp_number ?? INITIAL_SETTINGS.whatsappNumber
  };
}

function mapToSupabase(s: Partial<CatalogSettings>) {
  const row: any = { id: 'catalog_settings' };
  if (s.liveMode !== undefined) row.live_mode = s.liveMode;
  if (s.showPromotionBanner !== undefined) row.show_promotion_banner = s.showPromotionBanner;
  if (s.promotionBannerText !== undefined) row.promotion_banner_text = s.promotionBannerText;
  if (s.promotionButtonText !== undefined) row.promotion_button_text = s.promotionButtonText;
  if (s.promotionLink !== undefined) row.promotion_link = s.promotionLink;
  if (s.catalogTitle !== undefined) row.catalog_title = s.catalogTitle;
  if (s.whatsappNumber !== undefined) row.whatsapp_number = s.whatsappNumber;
  row.updated_at = new Date().toISOString();
  return row;
}

function getStoredCache(): { data: CatalogSettings; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

function saveCache(settings: CatalogSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: settings,
      timestamp: Date.now()
    }));
  }
}

export const settingsService = {
  async getSettings(forceRefresh = false): Promise<CatalogSettings> {
    const cached = getStoredCache();
    const now = Date.now();

    if (!forceRefresh && cached && cached.data && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'catalog_settings')
        .single();

      if (!error && data) {
        const mapped = mapFromSupabase(data);
        saveCache(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Falha ao buscar settings no Supabase, usando cache local:', e);
    }

    if (cached && cached.data) return cached.data;
    return INITIAL_SETTINGS;
  },

  async updateSettings(newSettings: Partial<CatalogSettings>): Promise<CatalogSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };

    try {
      const { error } = await supabase
        .from('settings')
        .upsert(mapToSupabase(updated));

      if (error) console.error('Erro ao atualizar settings no Supabase:', error);
    } catch (e) {
      console.warn('Falha ao salvar settings no Supabase:', e);
    }

    saveCache(updated);
    return updated;
  },

  async toggleLiveMode(): Promise<boolean> {
    const current = await this.getSettings();
    const updated = await this.updateSettings({ liveMode: !current.liveMode });
    return updated.liveMode;
  }
};
