import { Category, INITIAL_CATEGORIES } from '@/data/mockAdminData';
import { supabase } from '@/lib/supabase';
import { productService } from './productService';

const STORAGE_KEY = 'amadeireira_admin_categories_v2';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache

function getStoredCache(): { data: Category[]; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

function saveCache(categories: Category[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: categories,
      timestamp: Date.now()
    }));
  }
}

export const categoryService = {
  async getAll(forceRefresh = false): Promise<Category[]> {
    const cached = getStoredCache();
    const now = Date.now();

    if (!forceRefresh && cached && cached.data && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        saveCache(data);
        return data;
      }
    } catch (e) {
      console.warn('Falha ao buscar categorias no Supabase, usando cache local:', e);
    }

    if (cached && cached.data) return cached.data;
    return INITIAL_CATEGORIES.sort((a, b) => a.order - b.order);
  },

  async getById(id: string): Promise<Category | null> {
    const categories = await this.getAll();
    return categories.find(c => c.id === id) || null;
  },

  async create(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const categories = await this.getAll(true);
    const slugId = categoryData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const newCategory: Category = {
      ...categoryData,
      id: slugId
    };

    try {
      const { error } = await supabase.from('categories').insert(newCategory);
      if (error) console.error('Erro ao criar categoria no Supabase:', error);
    } catch (e) {
      console.warn('Falha de rede ao criar categoria no Supabase:', e);
    }
    
    const updated = [...categories, newCategory];
    saveCache(updated);
    return newCategory;
  },

  async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id);

      if (error) console.error('Erro ao atualizar categoria no Supabase:', error);
    } catch (e) {
      console.warn('Falha de rede ao atualizar categoria no Supabase:', e);
    }

    const categories = await this.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    saveCache(categories);
    return updatedCategory;
  },

  async toggleActive(id: string): Promise<Category | null> {
    const categories = await this.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    return this.update(id, { active: !categories[index].active });
  },

  async delete(id: string): Promise<{ success: boolean; hasProducts?: boolean; count?: number }> {
    const products = await productService.getAll();
    const linkedProducts = products.filter(p => p.category === id);

    if (linkedProducts.length > 0) {
      return { success: false, hasProducts: true, count: linkedProducts.length };
    }

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) console.error('Erro ao deletar categoria no Supabase:', error);
    } catch (e) {
      console.warn('Falha ao deletar categoria no Supabase:', e);
    }

    const categories = await this.getAll();
    const filtered = categories.filter(c => c.id !== id);
    saveCache(filtered);
    return { success: true };
  }
};
