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
  KeyRound,
  Edit2,
  Lock,
  CheckSquare,
  Square
} from 'lucide-react';
import { userService, authService } from '@/services/userService';
import { User, UserRole, AdminTabId } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const ALL_TABS: { id: AdminTabId; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Visão geral e métricas do catálogo' },
  { id: 'produtos', label: 'Produtos', description: 'Cadastrar, editar e gerenciar peças' },
  { id: 'categorias', label: 'Categorias', description: 'Gerenciar categorias e ordenação' },
  { id: 'live', label: 'Catálogo Live', description: 'Ativar Modo Live e faixa promocional' },
  { id: 'usuarios', label: 'Usuários & Permissões', description: 'Gerenciar contas, senhas e abas visíveis' },
  { id: 'configuracoes', label: 'Configurações', description: 'Parâmetros gerais do site e WhatsApp' }
];

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Current logged in user permission check
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMINISTRADOR';

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EDITOR');
  const [selectedTabs, setSelectedTabs] = useState<AdminTabId[]>([
    'dashboard',
    'produtos',
    'categorias'
  ]);

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
    setEditingUserId(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('ADMINISTRADOR');
    setSelectedTabs(ALL_TABS.map(t => t.id));
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setConfirmPassword('');
    setRole(user.role);
    setSelectedTabs(
      user.allowedTabs || ['dashboard', 'produtos', 'categorias']
    );
    setIsModalOpen(true);
  };

  const handleToggleTab = (tabId: AdminTabId) => {
    if (role === 'ADMINISTRADOR') return; // Admins get all tabs automatically
    setSelectedTabs(prev =>
      prev.includes(tabId) ? prev.filter(t => t !== tabId) : [...prev, tabId]
    );
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Campos Obrigatórios', 'Por favor preencha nome e e-mail.', 'error');
      return;
    }

    // Password validations
    if (!editingUserId && !password) {
      showToast('Senha Requerida', 'Por favor informe uma senha para o novo usuário.', 'error');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Senhas Diferentes', 'A confirmação de senha não confere.', 'error');
      return;
    }

    const finalTabs = role === 'ADMINISTRADOR'
      ? ALL_TABS.map(t => t.id)
      : selectedTabs;

    if (editingUserId) {
      // Edit User
      const updated = await userService.update(editingUserId, {
        name,
        email,
        role,
        allowedTabs: finalTabs
      });

      setIsModalOpen(false);
      if (updated) {
        showToast('Usuário Atualizado!', `As permissões de "${updated.name}" foram salvas.`, 'success');
        loadUsers();
      }
    } else {
      // Create User
      const created = await userService.create({
        name,
        email,
        role,
        allowedTabs: finalTabs
      });

      setIsModalOpen(false);
      if (created) {
        showToast('Usuário Cadastrado!', `"${created.name}" agora possui acesso com as abas selecionadas.`, 'success');
        loadUsers();
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    if (!isAdmin) {
      showToast('Acesso Restrito', 'Apenas Administradores podem alterar o status de acesso.', 'error');
      return;
    }
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
          <div className="w-8 h-8 border-4 border-[#8c5b2b] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Carregando usuários do painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e7e0d5] shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-[#1c1511]">Gestão de Usuários & Permissões ({users.length})</h2>
          <p className="text-xs text-[#736557]">
            {isAdmin
              ? 'Administradores gerenciam senhas e quais abas cada usuário pode acessar.'
              : 'Apenas Administradores podem alterar senhas e definir permissões de abas.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {/* Desktop Users Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#e7e0d5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf7] border-b border-[#e7e0d5] text-[11px] font-bold text-[#736557] uppercase tracking-wider">
              <th className="py-4 px-6">Usuário</th>
              <th className="py-4 px-6">E-mail</th>
              <th className="py-4 px-6">Perfil</th>
              <th className="py-4 px-6">Abas Visíveis (Permissões)</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ece3] text-sm">
            {users.map(user => {
              const allowed = user.allowedTabs || ALL_TABS.map(t => t.id);
              const isUserAdmin = user.role === 'ADMINISTRADOR';

              return (
                <tr key={user.id} className="hover:bg-[#fcf9f4] transition-colors">
                  {/* User Name & Initial */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fcf6eb] text-[#8c5b2b] border border-[#ebdcc9] flex items-center justify-center font-bold text-sm shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1c1511]">{user.name}</p>
                        <p className="text-[11px] text-[#8c7d6e] font-mono">id: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 font-medium text-[#3b2d23]">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-6">
                    {isUserAdmin ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fcf6eb] text-[#8c5b2b] border border-[#ebdcc9]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8c5b2b]" /> Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                        <UserCheck className="w-3.5 h-3.5" /> Editor
                      </span>
                    )}
                  </td>

                  {/* Allowed Tabs Badges */}
                  <td className="py-4 px-6">
                    {isUserAdmin ? (
                      <span className="text-xs font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2.5 py-1 rounded-lg border border-[#ebdcc9]">
                        ✓ Todas as Abas (Acesso Total)
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {ALL_TABS.map(tab => {
                          const isPermitted = allowed.includes(tab.id);
                          if (!isPermitted) return null;
                          return (
                            <span
                              key={tab.id}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                            >
                              {tab.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      disabled={!isAdmin}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        user.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      } ${!isAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      {user.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {user.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fcf6eb] hover:bg-[#f5ebd7] text-[#8c5b2b] border border-[#ebdcc9] font-bold text-xs rounded-xl transition-all shadow-sm"
                        title="Editar usuário, permissões e senha"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Excluir usuário"
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

      {/* Mobile Users Cards List */}
      <div className="md:hidden space-y-3">
        {users.map(user => {
          const allowed = user.allowedTabs || ALL_TABS.map(t => t.id);
          const isUserAdmin = user.role === 'ADMINISTRADOR';

          return (
            <div key={user.id} className="bg-white rounded-2xl p-4 border border-[#e7e0d5] shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fcf6eb] text-[#8c5b2b] border border-[#ebdcc9] flex items-center justify-center font-bold text-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1c1511] text-sm">{user.name}</h4>
                    <p className="text-xs text-[#736557] font-medium">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {user.active ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              {/* Allowed Tabs on Mobile */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#736557] uppercase tracking-wider block">Abas Permitidas:</span>
                {isUserAdmin ? (
                  <span className="text-[10px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2 py-0.5 rounded border border-[#ebdcc9] inline-block">
                    Acesso Total (Todas as Abas)
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {ALL_TABS.map(tab => {
                      if (!allowed.includes(tab.id)) return null;
                      return (
                        <span key={tab.id} className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                          {tab.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f2ece3] text-xs">
                <div>
                  {isUserAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fcf6eb] text-[#8c5b2b] border border-[#ebdcc9]">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                      <UserCheck size={12} /> Editor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[#8c5b2b] bg-[#fcf6eb] rounded-lg border border-[#ebdcc9] font-bold text-xs"
                    title="Editar permissões"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="p-1.5 text-rose-600 bg-rose-50 rounded-lg"
                    title="Excluir usuário"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar / Editar Usuário (Admin Only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8c5b2b]" />
                <h3 className="font-bold text-stone-900 text-base">
                  {editingUserId ? 'Editar Permissões do Usuário' : 'Novo Usuário do Painel'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Nome Completo: *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Carlos Silva"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none font-semibold text-stone-900"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none"
                />
              </div>

              {/* Password Section (Admin Only can change) */}
              <div className="p-4 bg-[#fdfbf7] rounded-2xl border border-[#ebdcc9] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8c5b2b]">
                  <KeyRound className="w-4 h-4" />
                  <span>{editingUserId ? 'Alterar Senha do Usuário (Opcional)' : 'Definir Senha do Usuário'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {editingUserId ? 'Nova Senha:' : 'Senha: *'}
                    </label>
                    <input
                      type="password"
                      required={!editingUserId}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Confirmar Senha:
                    </label>
                    <input
                      type="password"
                      required={!editingUserId && !!password}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1">Perfil de Acesso: *</label>
                <select
                  value={role}
                  onChange={e => {
                    const newRole = e.target.value as UserRole;
                    setRole(newRole);
                    if (newRole === 'ADMINISTRADOR') {
                      setSelectedTabs(ALL_TABS.map(t => t.id));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8c5b2b] focus:outline-none font-semibold text-stone-900"
                >
                  <option value="EDITOR">Editor (Permissões personalizadas por aba)</option>
                  <option value="ADMINISTRADOR">Administrador (Acesso total a todas as abas)</option>
                </select>
              </div>

              {/* Tab Permissions Selection */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <label className="block text-xs font-bold text-[#1c1511]">
                  Abas que este usuário pode ver e acessar: *
                </label>

                {role === 'ADMINISTRADOR' ? (
                  <div className="p-3 bg-[#fcf6eb] rounded-xl border border-[#ebdcc9] text-xs font-semibold text-[#8c5b2b]">
                    ✓ Administradores possuem acesso automático a todas as abas do painel.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_TABS.map(tab => {
                      const isSelected = selectedTabs.includes(tab.id);
                      return (
                        <div
                          key={tab.id}
                          onClick={() => handleToggleTab(tab.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-[#fcf6eb] border-[#c8a97e] text-[#1c1511] font-bold shadow-sm'
                              : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          <div className="mt-0.5 text-[#8c5b2b]">
                            {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-stone-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{tab.label}</p>
                            <p className="text-[10px] text-stone-500 font-normal leading-tight mt-0.5">{tab.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  <Save className="w-4 h-4" /> {editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
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
