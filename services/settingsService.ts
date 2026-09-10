import { CatalogSettings, INITIAL_SETTINGS } from '@/data/mockAdminData';

const STORAGE_KEY = 'amadeireira_admin_settings_v1';

function getStoredSettings(): CatalogSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

function saveSettings(settings: CatalogSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

export const settingsService = {
  async getSettings(): Promise<CatalogSettings> {
    return getStoredSettings();
  },

  async updateSettings(newSettings: Partial<CatalogSettings>): Promise<CatalogSettings> {
    const current = getStoredSettings();
    const updated = { ...current, ...newSettings };
    saveSettings(updated);
    return updated;
  },

  async toggleLiveMode(): Promise<boolean> {
    const current = getStoredSettings();
    const updated = { ...current, liveMode: !current.liveMode };
    saveSettings(updated);
    return updated.liveMode;
  }
};
