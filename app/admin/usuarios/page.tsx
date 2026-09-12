'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
          <div className="w-8 h-8 border-2 border-[#8c5b2b] border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-[#736557] font-semibold uppercase tracking-wider">Carregando usuários do painel...</p>
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
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#ded6c7] shadow-sm">
        <div>
          <h2 className="text-lg font-black text-[#17100b] tracking-tight">Gestão de Usuários & Permissões ({users.length})</h2>
          <p className="text-xs text-[#736557]">
            {isAdmin
              ? 'Administradores gerenciam senhas e quais abas cada usuário pode acessar.'
              : 'Apenas Administradores podem alterar senhas e definir permissões de abas.'}
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm transition-all shrink-0 border border-[#c8a97e]/40 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Novo Usuário
        </motion.button>
      </div>

      {/* Desktop Users Table */}
      <div className="hidden md:block bg-white rounded-none border border-[#ece4d8] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf7] border-b border-[#ece4d8] text-[10px] font-extrabold text-[#736557] uppercase tracking-wider">
              <th className="py-4 px-6">Usuário</th>
              <th className="py-4 px-6">E-mail</th>
              <th className="py-4 px-6">Perfil</th>
              <th className="py-4 px-6">Abas Visíveis (Permissões)</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user, index) => {
              const isUserAdmin = user.role === 'ADMINISTRADOR';

              return (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? 'bg-white hover:bg-[#f5ebd6]/50' : 'bg-[#f8f4ee] hover:bg-[#f0e3cc]/60'
                  }`}
                >
                  {/* User Name & Initial */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-none bg-[#fcf6eb] text-[#8c5b2b] flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#17100b]">{user.name}</p>
                        <p className="text-[10px] text-[#8c7a67] font-mono">id: {user.id}</p>
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold bg-[#fcf6eb] text-[#8c5b2b] uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8c5b2b]" /> Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold bg-stone-100 text-stone-700 uppercase tracking-wider">
                        <UserCheck className="w-3.5 h-3.5" /> Editor
                      </span>
                    )}
                  </td>

                  {/* Allowed Tabs Badges */}
                  <td className="py-4 px-6">
                    {isUserAdmin ? (
                      <span className="text-[11px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2.5 py-1 rounded-none uppercase tracking-wider">
                        ✓ Todas as Abas (Acesso Total)
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-none uppercase tracking-wider">
                        Personalizado
                      </span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      disabled={!isAdmin}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-none text-xs font-bold transition-colors ${
                        user.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fcf6eb] hover:bg-[#f5ebd6] text-[#8c5b2b] font-bold text-xs rounded-none transition-all shadow-sm uppercase tracking-wider"
                        title="Editar usuário, permissões e senha"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-none transition-colors"
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
        {users.map((user, index) => {
          const isUserAdmin = user.role === 'ADMINISTRADOR';

          return (
            <div
              key={user.id}
              className={`rounded-none p-4 border border-[#ece4d8] shadow-sm space-y-3 ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#f8f4ee]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-[#fcf6eb] text-[#8c5b2b] border border-[#ded1be] flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#17100b] text-sm">{user.name}</h4>
                    <p className="text-xs text-[#736557] font-medium">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-none ${
                    user.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {user.active ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              {/* Allowed Tabs on Mobile */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] font-extrabold text-[#736557] uppercase tracking-wider block">Abas Permitidas:</span>
                {isUserAdmin ? (
                  <span className="text-[10px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2 py-0.5 rounded-none border border-[#ded1be] inline-block uppercase tracking-wider">
                    Acesso Total (Todas as Abas)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-none border border-stone-200 inline-block uppercase tracking-wider">
                    Personalizado
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f2ece3] text-xs">
                <div>
                  {isUserAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-bold bg-[#fcf6eb] text-[#8c5b2b] border border-[#ded1be] uppercase tracking-wider">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200 uppercase tracking-wider">
                      <UserCheck size={12} /> Editor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[#8c5b2b] bg-[#fcf6eb] rounded-none border border-[#ded1be] font-bold text-xs uppercase tracking-wider"
                    title="Editar permissões"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="p-1.5 text-rose-700 bg-rose-50 border border-rose-200 rounded-none uppercase tracking-wider"
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

      {/* Modal Criar / Editar Usuário (Admin Only) with Motion */}
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
              className="relative z-10 bg-white rounded-none max-w-lg w-full p-6 shadow-2xl border border-[#ded6c7] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#f0e9dd] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#8c5b2b]" />
                  <h3 className="font-extrabold text-[#17100b] text-base tracking-tight uppercase tracking-wider">
                    {editingUserId ? 'Editar Permissões do Usuário' : 'Novo Usuário do Painel'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-none hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Nome Completo: *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ex: Carlos Silva"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">E-mail de Acesso: *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="carlos@amadeireira.com.br"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-medium"
                  />
                </div>

                {/* Password Section */}
                <div className="p-4 bg-[#fcfaf7] rounded-none border border-[#ebdcc9] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8c5b2b]">
                    <KeyRound className="w-4 h-4" />
                    <span>{editingUserId ? 'Alterar Senha do Usuário (Opcional)' : 'Definir Senha do Usuário'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-[#736557] mb-1 uppercase tracking-wider">
                        {editingUserId ? 'Nova Senha:' : 'Senha: *'}
                      </label>
                      <input
                        type="password"
                        required={!editingUserId}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-[#736557] mb-1 uppercase tracking-wider">
                        Confirmar Senha:
                      </label>
                      <input
                        type="password"
                        required={!editingUserId && !!password}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#ded6c7] rounded-none focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Perfil de Acesso: *</label>
                  <select
                    value={role}
                    onChange={e => {
                      const newRole = e.target.value as UserRole;
                      setRole(newRole);
                      if (newRole === 'ADMINISTRADOR') {
                        setSelectedTabs(ALL_TABS.map(t => t.id));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
                  >
                    <option value="EDITOR">Editor (Permissões personalizadas por aba)</option>
                    <option value="ADMINISTRADOR">Administrador (Acesso total a todas as abas)</option>
                  </select>
                </div>

                {/* Tab Permissions Selection */}
                <div className="space-y-2 pt-1 border-t border-[#f0e9dd]">
                  <label className="block text-xs font-bold text-[#17100b]">
                    Abas que este usuário pode ver e acessar: *
                  </label>

                  {role === 'ADMINISTRADOR' ? (
                    <div className="p-3 bg-[#fcf6eb] rounded-none border border-[#ded1be] text-xs font-bold text-[#8c5b2b]">
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
                            className={`p-3 rounded-none border cursor-pointer transition-all flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-[#fcf6eb] border-[#c8a97e] text-[#17100b] font-bold shadow-sm'
                                : 'bg-[#fcfaf7] border-[#ded6c7] text-stone-500 hover:bg-[#f5ebd6]'
                            }`}
                          >
                            <div className="mt-0.5 text-[#8c5b2b]">
                              {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-stone-400" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{tab.label}</p>
                              <p className="text-[10px] text-[#736557] font-normal leading-tight mt-0.5">{tab.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                    <Save className="w-4 h-4" /> {editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </motion.div>
  );
}
