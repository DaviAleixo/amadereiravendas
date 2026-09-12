'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  X,
  Save
} from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { Category, Product } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for New/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(1);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [linkedCount, setLinkedCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [cats, prods] = await Promise.all([
      categoryService.getAll(),
      productService.getAll()
    ]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  }

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setActive(true);
    setOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setActive(cat.active);
    setOrder(cat.order);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nome Obrigatório', 'Por favor informe o nome da categoria.', 'error');
      return;
    }

    if (editingCategory) {
      const updated = await categoryService.update(editingCategory.id, {
        name,
        description,
        active,
        order
      });
      if (updated) {
        showToast('Categoria Atualizada', `"${updated.name}" foi salva com sucesso.`, 'success');
      }
    } else {
      const created = await categoryService.create({
        name,
        description,
        active,
        order
      });
      if (created) {
        showToast('Categoria Criada', `"${created.name}" foi adicionada ao catálogo.`, 'success');
      }
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleToggleActive = async (id: string) => {
    const updated = await categoryService.toggleActive(id);
    if (updated) {
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
      showToast(
        updated.active ? 'Categoria Ativada' : 'Categoria Desativada',
        `"${updated.name}" agora está ${updated.active ? 'ativa' : 'inativa'}.`,
        'info'
      );
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const tempOrder = list[index].order;
    list[index].order = list[targetIndex].order;
    list[targetIndex].order = tempOrder;

    await Promise.all([
      categoryService.update(list[index].id, { order: list[index].order }),
      categoryService.update(list[targetIndex].id, { order: list[targetIndex].order })
    ]);

    loadData();
  };

  const handleStartDelete = (cat: Category) => {
    const count = products.filter(p => p.category === cat.id).length;
    setLinkedCount(count);
    setDeleteTarget(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await categoryService.delete(deleteTarget.id);
    setDeleteTarget(null);

    if (res.success) {
      showToast('Categoria Excluída', `"${deleteTarget.name}" foi removida.`, 'error');
      loadData();
    } else if (res.hasProducts) {
      showToast(
        'Não foi possível excluir',
        `A categoria possui ${res.count} produtos associados. Reassocie os produtos primeiro.`,
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#8c5b2b] border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-[#736557] font-semibold uppercase tracking-wider">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#ded6c7] shadow-sm">
        <div>
          <h2 className="text-lg font-black text-[#17100b] tracking-tight">Categorias do Catálogo ({categories.length})</h2>
          <p className="text-xs text-[#736557]">Organize a ordem e os grupos onde as peças serão filtradas no site.</p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm transition-all shrink-0 border border-[#c8a97e]/40 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Nova Categoria
        </motion.button>
      </div>

      {/* Desktop Categories Table */}
      <div className="hidden md:block bg-white rounded-none border border-[#ece4d8] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf7] border-b border-[#ece4d8] text-[10px] font-extrabold text-[#736557] uppercase tracking-wider">
              <th className="py-4 px-6">Ordem</th>
              <th className="py-4 px-6">Nome da Categoria</th>
              <th className="py-4 px-6 text-center">Produtos Vinculados</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {categories.map((cat, index) => {
              const count = products.filter(p => p.category === cat.id).length;

              return (
                <tr
                  key={cat.id}
                  className={`transition-colors group ${
                    index % 2 === 0 ? 'bg-white hover:bg-[#f5ebd6]/50' : 'bg-[#f8f4ee] hover:bg-[#f0e3cc]/60'
                  }`}
                >
                  {/* Order controls */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-bold text-[#17100b]">
                      <span className="w-6 text-center text-xs font-mono font-bold">#{cat.order}</span>
                      <div className="flex flex-col">
                        {index > 0 && (
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-0.5 text-stone-400 hover:text-[#8c5b2b]"
                            title="Subir ordem"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {index < categories.length - 1 && (
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-0.5 text-stone-400 hover:text-[#8c5b2b]"
                            title="Descer ordem"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Name & Desc */}
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#17100b]">{cat.name}</p>
                    {cat.description && <p className="text-xs text-[#736557] mt-0.5">{cat.description}</p>}
                  </td>

                  {/* Linked Products Count */}
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-3 py-0.5 rounded-none uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-[#8c5b2b]" /> {count} peças
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-none text-xs font-bold transition-colors ${
                        cat.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {cat.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {cat.active ? 'Ativa' : 'Inativa'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 text-[#5c4a3b] hover:text-[#8c5b2b] hover:bg-[#fcf6eb] rounded-none transition-colors"
                        title="Editar categoria"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartDelete(cat)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-none transition-colors"
                        title="Excluir categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Categories Cards List */}
      <div className="md:hidden space-y-3">
        {categories.map((cat, index) => {
          const count = products.filter(p => p.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className={`rounded-none p-4 border border-[#ece4d8] shadow-sm space-y-3 ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#f8f4ee]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-none bg-[#fcf6eb] text-[#8c5b2b] font-mono font-bold text-xs flex items-center justify-center border border-[#ded1be]">
                    #{cat.order}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#17100b] text-sm">{cat.name}</h4>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(cat.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-none ${
                    cat.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {cat.active ? 'Ativa' : 'Inativa'}
                </button>
              </div>

              {cat.description && (
                <p className="text-xs text-[#736557] bg-[#fcfaf7] p-2.5 rounded-none border border-[#f0e9dd] leading-relaxed">
                  {cat.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#f2ece3] text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2 py-0.5 rounded-none border border-[#ded1be] text-[11px] uppercase tracking-wider">
                  <Layers size={12} /> {count} peças vinculadas
                </span>

                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 bg-[#fcfaf7] border border-[#ded6c7] rounded-none text-stone-600"
                      title="Subir ordem"
                    >
                      <ArrowUp size={14} />
                    </button>
                  )}
                  {index < categories.length - 1 && (
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 bg-[#fcfaf7] border border-[#ded6c7] rounded-none text-stone-600"
                      title="Descer ordem"
                    >
                      <ArrowDown size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 bg-[#fcf6eb] text-[#8c5b2b] border border-[#ded1be] rounded-none font-bold text-xs flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                  <button
                    onClick={() => handleStartDelete(cat)}
                    className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-none uppercase tracking-wider"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova / Editar Categoria with Motion */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#090604]/75 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 bg-white rounded-none max-w-md w-full p-6 shadow-2xl border border-[#ded6c7] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f0e9dd] pb-3">
                <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-none hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Nome da Categoria: *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ex: Mesas Orgânicas"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Descrição Opcional:</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Breve descrição da categoria para o catálogo..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Ordem de Exibição:</label>
                    <input
                      type="number"
                      min={1}
                      value={order}
                      onChange={e => setOrder(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Status:</label>
                    <select
                      value={active ? 'active' : 'inactive'}
                      onChange={e => setActive(e.target.value === 'active')}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
                    >
                      <option value="active">Ativa</option>
                      <option value="inactive">Inativa</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0e9dd]">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5c4a3b] bg-[#f7f3eb] hover:bg-[#ede3d3] border border-[#ded6c7] rounded-none uppercase tracking-wider"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4" /> Salvar Categoria
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={`Excluir Categoria "${deleteTarget?.name}"?`}
        description={
          linkedCount > 0
            ? `⚠️ ATENÇÃO: Esta categoria possui ${linkedCount} produtos associados no catálogo. Se você excluir, esses produtos precisarão ser reagrupados.`
            : 'Tem certeza que deseja remover esta categoria do catálogo?'
        }
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        variant={linkedCount > 0 ? 'warning' : 'danger'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
