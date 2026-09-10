'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Category, PriceGroup, Product } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { PriceGroupInput } from '@/components/admin/PriceGroupInput';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string, 10);
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [wood, setWood] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [normalPrice, setNormalPrice] = useState<PriceGroup>({ price: 0, installments: '' });
  const [livePrice, setLivePrice] = useState<PriceGroup | undefined>(undefined);

  useEffect(() => {
    async function init() {
      const [cats, prod] = await Promise.all([
        categoryService.getAll(),
        productService.getById(productId)
      ]);
      setCategories(cats);

      if (prod) {
        setProduct(prod);
        setName(prod.name);
        setCategoryId(prod.category);
        setWood(prod.wood);
        setDimensions(prod.dimensions);
        setDescription(prod.description);
        setActive(prod.active);
        setImages(prod.images || []);
        setNormalPrice(prod.normalPrice);
        setLivePrice(prod.livePrice);
      } else {
        showToast('Produto não encontrado', `Nenhum produto com ID #${productId} foi localizado.`, 'error');
        router.push('/admin/produtos');
      }
      setLoading(false);
    }
    init();
  }, [productId, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || normalPrice.price <= 0) {
      showToast('Campos Incompletos', 'Por favor preencha o nome, categoria e preço normal.', 'error');
      return;
    }

    setSaving(true);

    const selectedCatObj = categories.find(c => c.id === categoryId);

    const updatedData: Partial<Product> = {
      name,
      category: categoryId,
      categoryLabel: selectedCatObj ? selectedCatObj.name : categoryId,
      dimensions,
      wood,
      description,
      images,
      active,
      normalPrice,
      livePrice: livePrice && livePrice.price > 0 ? livePrice : undefined
    };

    const updated = await productService.update(productId, updatedData);
    setSaving(false);

    if (updated) {
      showToast('Produto Atualizado!', `"${updated.name}" foi salvo com sucesso.`, 'success');
      router.push('/admin/produtos');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando dados do produto #{productId}...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para a lista
        </Link>
        <span className="text-xs font-mono text-stone-400">Editando id: #{product.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-900" />
              <h3 className="font-bold text-stone-900 text-base">Informações do Produto #{product.id}</h3>
            </div>
            <span className="text-xs font-bold text-stone-400 font-mono">slug: {product.slug}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-900 mb-1">Nome da Peça: *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">Categoria: *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wood Type */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">Tipo de Madeira:</label>
              <input
                type="text"
                value={wood}
                onChange={e => setWood(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Dimensions */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-900 mb-1">Tamanho / Dimensões:</label>
              <input
                type="text"
                value={dimensions}
                onChange={e => setDimensions(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-900 mb-1">Descrição Detalhada:</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2 flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <p className="text-xs font-bold text-stone-900">Visibilidade no Catálogo</p>
                <p className="text-[11px] text-stone-500">Defina se o produto ficará visível aos clientes no site público.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Prices Section Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base">Valores e Parcelamento (Preço Normal vs Live)</h3>
            <p className="text-xs text-stone-500">Preço Normal é o valor do catálogo regular. Preço Live é opcional para promoções.</p>
          </div>

          <PriceGroupInput
            normalPrice={normalPrice}
            livePrice={livePrice}
            onNormalPriceChange={setNormalPrice}
            onLivePriceChange={setLivePrice}
          />
        </div>

        {/* Images Section Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/produtos"
            className="px-5 py-3 text-sm font-semibold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando Alterações...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
