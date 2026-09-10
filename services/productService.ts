import { INITIAL_PRODUCTS, Product } from '@/data/mockAdminData';

const STORAGE_KEY = 'amadeireira_admin_products_v1';

function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
}

export const productService = {
  async getAll(): Promise<Product[]> {
    return getStoredProducts();
  },

  async getById(id: number): Promise<Product | null> {
    const products = getStoredProducts();
    return products.find(p => p.id === id) || null;
  },

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = getStoredProducts();
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct: Product = {
      ...productData,
      id: maxId + 1
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    return newProduct;
  },

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    const products = getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...productData };
    products[index] = updatedProduct;
    saveProducts(products);
    return updatedProduct;
  },

  async toggleActive(id: number): Promise<Product | null> {
    const products = getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index].active = !products[index].active;
    saveProducts(products);
    return products[index];
  },

  async delete(id: number): Promise<boolean> {
    const products = getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    saveProducts(filtered);
    return true;
  }
};
