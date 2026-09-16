import { INITIAL_PRODUCTS, Product } from '@/data/mockAdminData';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'amadeireira_admin_products_v2';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache inteligente

function mapFromSupabase(row: any): Product {
  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label || '',
    dimensions: row.dimensions || '',
    wood: row.wood || '',
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : [],
    active: row.active ?? true,
    normalPrice: row.normal_price || { price: 0, installments: '' },
    livePrice: row.live_price || undefined
  };
}

function mapToSupabase(product: Partial<Product>) {
  const row: any = {};
  if (product.id !== undefined) row.id = product.id;
  if (product.slug !== undefined) row.slug = product.slug;
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.categoryLabel !== undefined) row.category_label = product.categoryLabel;
  if (product.dimensions !== undefined) row.dimensions = product.dimensions;
  if (product.wood !== undefined) row.wood = product.wood;
  if (product.description !== undefined) row.description = product.description;
  if (product.images !== undefined) row.images = product.images;
  if (product.active !== undefined) row.active = product.active;
  if (product.normalPrice !== undefined) row.normal_price = product.normalPrice;
  if (product.livePrice !== undefined) row.live_price = product.livePrice;
  row.updated_at = new Date().toISOString();
  return row;
}

function getStoredCache(): { data: Product[]; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

function saveCache(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: products,
      timestamp: Date.now()
    }));
  }
}

export const productService = {
  async getAll(forceRefresh = false): Promise<Product[]> {
    const cached = getStoredCache();
    const now = Date.now();

    // Se temos cache recente e não forçamos atualização, retorna instantaneamente (0 Egress)
    if (!forceRefresh && cached && cached.data && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, slug, name, category, category_label, dimensions, wood, description, images, active, normal_price, live_price')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapFromSupabase);
        saveCache(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Falha na rede ao buscar produtos, usando cache local:', e);
    }

    if (cached && cached.data) return cached.data;
    return INITIAL_PRODUCTS;
  },

  async getById(id: number): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  },

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getAll(true);
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newId = maxId + 1;

    const newProduct: Product = {
      ...productData,
      id: newId
    };

    try {
      const { error } = await supabase
        .from('products')
        .insert(mapToSupabase(newProduct));

      if (error) {
        console.error('Erro ao criar produto no Supabase:', error);
      }
    } catch (e) {
      console.warn('Falha de rede ao criar produto no Supabase:', e);
    }

    const updated = [newProduct, ...products];
    saveCache(updated);
    return newProduct;
  },

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    try {
      const { error } = await supabase
        .from('products')
        .update(mapToSupabase(productData))
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar produto no Supabase:', error);
      }
    } catch (e) {
      console.warn('Falha de rede ao atualizar produto no Supabase:', e);
    }

    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...productData };
    products[index] = updatedProduct;
    saveCache(products);
    return updatedProduct;
  },

  async toggleActive(id: number): Promise<Product | null> {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const newActive = !products[index].active;
    return this.update(id, { active: newActive });
  },

  async delete(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto no Supabase:', error);
      }
    } catch (e) {
      console.warn('Falha de rede ao deletar produto no Supabase:', e);
    }

    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    saveCache(filtered);
    return true;
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      const sanitizedName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(sanitizedName, file, {
          contentType: file.type,
          upsert: true,
          cacheControl: '31536000' // 1 ano de cache no navegador / CDN para 0 egress repetido
        });

      if (uploadError) {
        console.error('Erro ao subir imagem para o storage:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(sanitizedName);

      return data.publicUrl;
    } catch (err) {
      console.error('Erro no upload de imagem:', err);
      return null;
    }
  }
};
