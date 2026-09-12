'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
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
          <div className="w-8 h-8 border-2 border-[#8c5b2b] border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-[#736557] font-semibold uppercase tracking-wider">Carregando dados do produto #{productId}...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <motion.div whileHover={{ x: -2 }}>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5c4a3b] hover:text-[#17100b] bg-white border border-[#ded6c7] px-3.5 py-2 rounded-none shadow-sm transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a lista
          </Link>
        </motion.div>
        <span className="text-xs font-mono font-bold text-[#8c7a67]">id: #{product.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-none p-6 border border-[#ded6c7] shadow-sm space-y-4">
          <div className="border-b border-[#f0e9dd] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8c5b2b]" />
              <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">Informações do Produto #{product.id}</h3>
            </div>
            <span className="text-xs font-bold text-[#8c7a67] font-mono">slug: {product.slug}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Nome da Peça: *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Categoria: *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium text-[#17100b]"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Tipo de Madeira:</label>
              <input
                type="text"
                value={wood}
                onChange={e => setWood(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium"
              />
            </div>

            {/* Dimensions */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Tamanho / Dimensões:</label>
              <input
                type="text"
                value={dimensions}
                onChange={e => setDimensions(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">Descrição Detalhada:</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium leading-relaxed"
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-[#fcfaf7] rounded-none border border-[#ded6c7]">
              <div>
                <p className="text-xs font-bold text-[#17100b]">Visibilidade no Catálogo</p>
                <p className="text-[11px] text-[#736557]">Defina se o produto ficará visível aos clientes no site público.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#ded6c7] peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8c5b2b]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Prices Section Card */}
        <div className="bg-white rounded-none p-6 border border-[#ded6c7] shadow-sm space-y-4">
          <div className="border-b border-[#f0e9dd] pb-3">
            <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">Valores e Parcelamento (Preço Normal vs Live)</h3>
            <p className="text-xs text-[#736557]">Preço Normal é o valor do catálogo regular. Preço Live é opcional para promoções.</p>
          </div>

          <PriceGroupInput
            normalPrice={normalPrice}
            livePrice={livePrice}
            onNormalPriceChange={setNormalPrice}
            onLivePriceChange={setLivePrice}
          />
        </div>

        {/* Images Section Card */}
        <div className="bg-white rounded-none p-6 border border-[#ded6c7] shadow-sm">
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/produtos"
            className="px-5 py-3 text-xs font-bold text-[#5c4a3b] bg-white hover:bg-[#fcfaf7] border border-[#ded6c7] rounded-none transition-colors uppercase tracking-wider"
          >
            Cancelar
          </Link>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm transition-all disabled:opacity-50 border border-[#c8a97e]/40 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando Alterações...' : 'Salvar Alterações'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
