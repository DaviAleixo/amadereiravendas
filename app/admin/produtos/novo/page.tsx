'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Category, PriceGroup } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { PriceGroupInput } from '@/components/admin/PriceGroupInput';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [wood, setWood] = useState('Madeira maciça');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>(['/capa.webp']);

  const [normalPrice, setNormalPrice] = useState<PriceGroup>({
    price: 0,
    installments: ''
  });
  const [livePrice, setLivePrice] = useState<PriceGroup | undefined>(undefined);

  useEffect(() => {
    categoryService.getAll().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || normalPrice.price <= 0) {
      showToast('Campos Incompletos', 'Por favor preencha o nome, categoria e preço normal.', 'error');
      return;
    }

    setLoading(true);

    const selectedCatObj = categories.find(c => c.id === categoryId);
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const newProductData = {
      slug,
      name,
      category: categoryId,
      categoryLabel: selectedCatObj ? selectedCatObj.name : categoryId,
      dimensions: dimensions || 'Medidas padrão',
      wood: wood || 'Madeira maciça',
      description: description || name,
      images: images.length > 0 ? images : ['/capa.webp'],
      active,
      normalPrice,
      livePrice: livePrice && livePrice.price > 0 ? livePrice : undefined
    };

    const created = await productService.create(newProductData);
    setLoading(false);

    if (created) {
      showToast('Produto Cadastrado!', `"${created.name}" foi adicionado ao catálogo com sucesso.`, 'success');
      router.push('/admin/produtos');
    }
  };

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
        <span className="text-xs font-semibold text-stone-400">Novo Produto</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-900" />
            <h3 className="font-bold text-stone-900 text-base">Informações Básicas do Produto</h3>
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
                placeholder="ex: Mesa Cascata Pequiá 340cm"
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
                placeholder="ex: Angelim, Pequiá, Aroeira, Resina..."
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
                placeholder="ex: 340 x 122 cm ou 156 x 33 x 88 cm de altura"
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
                placeholder="Descrição comercial da peça, capacidade de lugares e acabamento..."
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
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando Produto...' : 'Salvar Produto'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
