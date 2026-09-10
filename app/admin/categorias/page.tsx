'use client';

import React, { useEffect, useState } from 'react';
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
          <div className="w-8 h-8 border-4 border-[#8c5b2b] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e7e0d5] shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-[#1c1511]">Categorias do Catálogo ({categories.length})</h2>
          <p className="text-xs text-[#736557]">Organize a ordem e os grupos onde as peças serão filtradas no site.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      {/* Desktop Categories Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#e7e0d5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf7] border-b border-[#e7e0d5] text-[11px] font-bold text-[#736557] uppercase tracking-wider">
              <th className="py-4 px-6">Ordem</th>
              <th className="py-4 px-6">Nome da Categoria</th>
              <th className="py-4 px-6 text-center">Produtos Vinculados</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ece3] text-sm">
            {categories.map((cat, index) => {
              const count = products.filter(p => p.category === cat.id).length;

              return (
                <tr key={cat.id} className="hover:bg-[#fcf9f4] transition-colors group">
                  {/* Order controls */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-bold text-[#1c1511]">
                      <span className="w-6 text-center text-xs font-mono">{cat.order}</span>
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
                    <p className="font-bold text-[#1c1511]">{cat.name}</p>
                    {cat.description && <p className="text-xs text-[#736557] mt-0.5">{cat.description}</p>}
                  </td>

                  {/* Linked Products Count */}
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#8c5b2b] bg-[#fcf6eb] border border-[#ebdcc9] px-3 py-1 rounded-full">
                      <Layers className="w-3.5 h-3.5 text-[#8c5b2b]" /> {count} peças
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        cat.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
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
                        className="p-2 text-stone-500 hover:text-[#8c5b2b] hover:bg-[#fcf6eb] rounded-xl transition-colors"
                        title="Editar categoria"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartDelete(cat)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
            <div key={cat.id} className="bg-white rounded-2xl p-4 border border-[#e7e0d5] shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[#fcf6eb] text-[#8c5b2b] font-mono font-bold text-xs flex items-center justify-center border border-[#ebdcc9]">
                    #{cat.order}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#1c1511] text-sm">{cat.name}</h4>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(cat.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    cat.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.active ? 'Ativa' : 'Inativa'}
                </button>
              </div>

              {cat.description && (
                <p className="text-xs text-[#736557] bg-[#fdfbf7] p-2.5 rounded-xl border border-[#f0e9dd]">
                  {cat.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#f2ece3] text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2.5 py-0.5 rounded-md border border-[#ebdcc9]">
                  <Layers size={12} /> {count} peças vinculadas
                </span>

                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 bg-stone-100 rounded-lg text-stone-600"
                      title="Subir ordem"
                    >
                      <ArrowUp size={14} />
                    </button>
                  )}
                  {index < categories.length - 1 && (
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 bg-stone-100 rounded-lg text-stone-600"
                      title="Descer ordem"
                    >
                      <ArrowDown size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 bg-[#fcf6eb] text-[#8c5b2b] rounded-lg font-bold text-xs flex items-center gap-1"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                  <button
                    onClick={() => handleStartDelete(cat)}
                    className="p-1.5 bg-rose-50 text-rose-700 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova / Editar Categoria */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Nome da Categoria: *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Mesas Orgânicas"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Descrição Opcional:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Breve descrição da categoria para o catálogo..."
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">Ordem de Exibição:</label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">Status:</label>
                  <select
                    value={active ? 'active' : 'inactive'}
                    onChange={e => setActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  <Save className="w-4 h-4" /> Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}
