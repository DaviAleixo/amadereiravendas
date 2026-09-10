import { Category, INITIAL_CATEGORIES } from '@/data/mockAdminData';
import { productService } from './productService';

const STORAGE_KEY = 'amadeireira_admin_categories_v1';

function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
}

function saveCategories(categories: Category[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const categories = getStoredCategories();
    return categories.sort((a, b) => a.order - b.order);
  },

  async getById(id: string): Promise<Category | null> {
    const categories = getStoredCategories();
    return categories.find(c => c.id === id) || null;
  },

  async create(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const categories = getStoredCategories();
    const slugId = categoryData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newCategory: Category = {
      ...categoryData,
      id: slugId
    };
    
    const updated = [...categories, newCategory];
    saveCategories(updated);
    return newCategory;
  },

  async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    saveCategories(categories);
    return updatedCategory;
  },

  async toggleActive(id: string): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    categories[index].active = !categories[index].active;
    saveCategories(categories);
    return categories[index];
  },

  async delete(id: string): Promise<{ success: boolean; hasProducts?: boolean; count?: number }> {
    const products = await productService.getAll();
    const linkedProducts = products.filter(p => p.category === id);

    if (linkedProducts.length > 0) {
      return { success: false, hasProducts: true, count: linkedProducts.length };
    }

    const categories = getStoredCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
    return { success: true };
  }
};
