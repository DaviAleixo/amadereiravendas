'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  Save,
  KeyRound
} from 'lucide-react';
import { userService } from '@/services/userService';
import { User, UserRole } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EDITOR');

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await userService.getAll();
    setUsers(data);
    setLoading(false);
  }

  const handleOpenCreateModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('EDITOR');
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('Campos Obrigatórios', 'Por favor preencha nome, e-mail e senha.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Senhas Diferentes', 'A confirmação de senha não confere.', 'error');
      return;
    }

    const created = await userService.create({ name, email, role });
    setIsModalOpen(false);

    if (created) {
      showToast('Usuário Cadastrado!', `"${created.name}" agora tem acesso ao painel como ${created.role}.`, 'success');
      loadUsers();
    }
  };

  const handleToggleActive = async (id: string) => {
    const updated = await userService.toggleActive(id);
    if (updated) {
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      showToast(
        updated.active ? 'Acesso Ativado' : 'Acesso Suspenso',
        `A conta de "${updated.name}" foi ${updated.active ? 'reativada' : 'desativada'}.`,
        'info'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await userService.delete(deleteTarget.id);
    setDeleteTarget(null);

    if (success) {
      showToast('Usuário Removido', `"${deleteTarget.name}" foi removido do painel.`, 'error');
      loadUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando usuários do painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Usuários do Painel ({users.length})</h2>
          <p className="text-xs text-stone-500">Cadastre administradores e editores para gerenciar o catálogo.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-900/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-4 px-6">Usuário</th>
              <th className="py-4 px-6">E-mail</th>
              <th className="py-4 px-6">Perfil de Acesso</th>
              <th className="py-4 px-6">Última Atividade</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-stone-50/60 transition-colors">
                {/* User Name & Initial */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-900/10 text-amber-900 border border-amber-800/20 flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{user.name}</p>
                      <p className="text-[11px] text-stone-400 font-mono">id: {user.id}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-6 font-medium text-stone-700">
                  {user.email}
                </td>

                {/* Role Badge */}
                <td className="py-4 px-6">
                  {user.role === 'ADMINISTRADOR' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-900/10 text-amber-900 border border-amber-800/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                      <UserCheck className="w-3.5 h-3.5" /> Editor
                    </span>
                  )}
                </td>

                {/* Last Activity */}
                <td className="py-4 px-6 text-xs text-stone-500 font-medium">
                  {user.lastActivity || 'Recentemente'}
                </td>

                {/* Status Toggle */}
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleToggleActive(user.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      user.active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {user.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {user.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir usuário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-900" />
                <h3 className="font-bold text-stone-900 text-base">Novo Usuário do Painel</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Nome Completo: *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Carlos Silva"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">E-mail de Acesso: *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="carlos@amadeireira.com.br"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">Senha: *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">Confirmar Senha: *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Perfil de Permissão: *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
                >
                  <option value="EDITOR">Editor (Pode gerenciar catálogo e preços)</option>
                  <option value="ADMINISTRADOR">Administrador (Acesso total)</option>
                </select>
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  <Save className="w-4 h-4" /> Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={`Remover usuário "${deleteTarget?.name}"?`}
        description="Esta conta deixará de ter acesso ao painel de administração da Amadeireira."
        confirmText="Sim, Remover Usuário"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
