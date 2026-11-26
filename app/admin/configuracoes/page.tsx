'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Phone,
  Save,
  Users,
  Plus,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  KeyRound,
  Edit2,
  CheckSquare,
  Square
} from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { userService, authService } from '@/services/userService';
import { CatalogSettings, User, UserRole, AdminTabId } from '@/data/mockAdminData';
import { useToast } from '@/components/admin/ToastContainer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { formatWhatsappDisplay, cleanWhatsappDigits } from '@/lib/whatsapp';

const ALL_TABS: { id: AdminTabId; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Visão geral e métricas do catálogo' },
  { id: 'produtos', label: 'Produtos', description: 'Cadastrar, editar e gerenciar peças' },
  { id: 'categorias', label: 'Categorias', description: 'Gerenciar categorias e ordenação' },
  { id: 'live', label: 'Catálogo Live', description: 'Ativar Modo Live e faixa promocional' },
  { id: 'configuracoes', label: 'Configurações', description: 'Atendimento comercial, WhatsApp e usuários' }
];

function SettingsContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active Tab: 'geral' | 'usuarios'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'geral' | 'usuarios'>(
    tabParam === 'usuarios' ? 'usuarios' : 'geral'
  );

  useEffect(() => {
    if (tabParam === 'usuarios') {
      setActiveTab('usuarios');
    }
  }, [tabParam]);

  // Settings State
  const [settings, setSettings] = useState<CatalogSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMINISTRADOR';

  // Modal State for Create / Edit User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EDITOR');
  const [selectedTabs, setSelectedTabs] = useState<AdminTabId[]>([
    'dashboard',
    'produtos',
    'categorias'
  ]);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Load Settings
  useEffect(() => {
    async function loadSettings() {
      setSettingsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setWhatsappNumber(formatWhatsappDisplay(data.whatsappNumber));
      setSettingsLoading(false);
    }
    loadSettings();
  }, []);

  // Load Users
  useEffect(() => {
    async function loadUsers() {
      setUsersLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setUsersLoading(false);
    }
    loadUsers();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    const cleanNumber = cleanWhatsappDigits(whatsappNumber);
    const updated = await settingsService.updateSettings({
      whatsappNumber: cleanNumber
    });

    setSettings(updated);
    setWhatsappNumber(formatWhatsappDisplay(updated.whatsappNumber));
    setSavingSettings(false);
    showToast('Configurações Salvas', 'O número do WhatsApp comercial foi atualizado.', 'success');
  };

  const handleOpenCreateUser = () => {
    setEditingUserId(null);
    setUserName('');
    setPassword('');
    setConfirmPassword('');
    setRole('ADMINISTRADOR');
    setSelectedTabs(ALL_TABS.map(t => t.id));
    setIsModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUserName(user.name);
    setPassword('');
    setConfirmPassword('');
    setRole(user.role);
    setSelectedTabs(user.allowedTabs || ['dashboard', 'produtos', 'categorias']);
    setIsModalOpen(true);
  };

  const handleToggleTab = (tabId: AdminTabId) => {
    if (role === 'ADMINISTRADOR') return;
    setSelectedTabs(prev =>
      prev.includes(tabId) ? prev.filter(t => t !== tabId) : [...prev, tabId]
    );
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      showToast('Campos Obrigatórios', 'Por favor preencha o nome do usuário.', 'error');
      return;
    }

    if (!editingUserId && !password) {
      showToast('Senha Requerida', 'Por favor informe uma senha para o novo usuário.', 'error');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Senhas Diferentes', 'A confirmação de senha não confere.', 'error');
      return;
    }

    setSavingUser(true);
    const finalTabs = role === 'ADMINISTRADOR' ? ALL_TABS.map(t => t.id) : selectedTabs;

    try {
      if (editingUserId) {
        const updated = await userService.update(editingUserId, {
          name: userName.trim(),
          role,
          allowedTabs: finalTabs,
          ...(password ? { password } : {})
        });
        if (updated) {
          setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
          setIsModalOpen(false);
          showToast('Usuário Atualizado', `Permissões de "${updated.name}" salvas com sucesso.`, 'success');
        }
      } else {
        const created = await userService.create({
          name: userName.trim(),
          password,
          role,
          allowedTabs: finalTabs
        });
        // Atualiza a lista na interface instantaneamente
        setUsers(prev => {
          const exists = prev.some(u => u.id === created.id);
          if (exists) return prev.map(u => (u.id === created.id ? created : u));
          return [...prev, created];
        });
        setIsModalOpen(false);
        showToast('Usuário Cadastrado', `"${created.name}" adicionado à equipe com sucesso.`, 'success');
      }
    } catch (err: any) {
      showToast('Erro ao salvar usuário', err.message || 'Falha ao salvar no banco de dados.', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const refreshUsers = async () => {
    try {
      const data = await userService.getAll();
      if (data && data.length > 0) {
        setUsers(data);
      }
    } catch (e) {
      console.warn('Falha ao atualizar lista de usuários:', e);
    }
  };

  const handleToggleUserActive = async (id: string) => {
    if (!isAdmin) {
      showToast('Acesso Restrito', 'Apenas Administradores podem suspender usuários.', 'error');
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

  const handleConfirmDeleteUser = async () => {
    if (!deleteTarget) return;
    const success = await userService.delete(deleteTarget.id);
    setDeleteTarget(null);
    if (success) {
      showToast('Usuário Removido', `"${deleteTarget.name}" foi excluído.`, 'error');
      refreshUsers();
    }
  };

  if (settingsLoading && activeTab === 'geral') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-none animate-spin" />
          <p className="text-xs text-stone-500 font-medium tracking-wide">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#ded6c7] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-[#18110b] text-[#c8a97e] rounded-none border border-[#3d2719]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#17100b] tracking-tight">Configurações & Acessos</h2>
            <p className="text-xs text-[#736557]">Atendimento comercial e gestão de usuários do painel.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#f7f3eb] p-1 border border-[#ded6c7] rounded-none self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('geral');
              router.push('/admin/configuracoes');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
              activeTab === 'geral'
                ? 'bg-[#8c5b2b] text-white shadow-xs'
                : 'text-[#5c4a3b] hover:text-[#17100b] hover:bg-[#ede3d3]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Comercial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('usuarios');
              router.push('/admin/configuracoes?tab=usuarios');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-[#8c5b2b] text-white shadow-xs'
                : 'text-[#5c4a3b] hover:text-[#17100b] hover:bg-[#ede3d3]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuários & Acessos ({users.length})</span>
          </button>
        </div>
      </div>

      {/* ABA 1: ATENDIMENTO / WHATSAPP */}
      {activeTab === 'geral' && (
        <div className="admin-card-luxury p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200/80 pb-4">
            <h3 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8c5b2b]" />
              <span>Atendimento do Catálogo</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Defina o número comercial oficial utilizado em todos os links e botões de interesse da página de vendas.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Número do WhatsApp Comercial: *
              </label>
              <div className="relative max-w-md">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(formatWhatsappDisplay(e.target.value))}
                  placeholder="+55 (19) 98415-3232"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-none focus:ring-2 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-mono font-bold text-stone-900 shadow-sm transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                Máscara automática: <strong>+55 (DDD) 9XXXX-XXXX</strong>. Basta digitar os números, o código do país (+55) e os separadores são inseridos automaticamente.
              </p>
            </div>

            <div className="flex justify-start pt-4 border-t border-stone-200/80">
              <motion.button
                type="submit"
                disabled={savingSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-extrabold text-xs uppercase tracking-wider rounded-none shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Salvando...' : 'Salvar WhatsApp'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 2: USUÁRIOS & PERMISSÕES */}
      {activeTab === 'usuarios' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#ded6c7] shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#17100b] tracking-tight">Equipe & Contas de Acesso</h3>
              <p className="text-xs text-[#736557]">
                {isAdmin
                  ? 'Administradores podem criar novos acessos, redefinir senhas e configurar abas permitidas.'
                  : 'Consulte os usuários do painel. Apenas administradores alteram senhas e abas.'}
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenCreateUser}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm transition-all shrink-0 border border-[#c8a97e]/40 uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo Usuário
            </motion.button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-none border border-[#ece4d8] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfaf7] border-b border-[#ece4d8] text-[10px] font-extrabold text-[#736557] uppercase tracking-wider">
                  <th className="py-4 px-6">Usuário</th>
                  <th className="py-4 px-6">Perfil</th>
                  <th className="py-4 px-6">Abas Permitidas</th>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-none bg-[#fcf6eb] text-[#8c5b2b] flex items-center justify-center font-bold text-xs shrink-0 border border-[#ded1be]">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#17100b]">{user.name}</p>
                            <p className="text-[10px] text-[#8c7a67] font-mono">id: {user.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isUserAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold bg-[#fcf6eb] text-[#8c5b2b] uppercase tracking-wider border border-[#ded1be]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8c5b2b]" /> Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold bg-stone-100 text-stone-700 uppercase tracking-wider border border-stone-200">
                            <UserCheck className="w-3.5 h-3.5" /> Editor
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {isUserAdmin ? (
                          <span className="text-[11px] font-bold text-[#8c5b2b] bg-[#fcf6eb] px-2.5 py-1 rounded-none uppercase tracking-wider border border-[#ded1be]">
                            ✓ Acesso Total
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-none uppercase tracking-wider border border-stone-200">
                            Personalizado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleUserActive(user.id)}
                          disabled={!isAdmin}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-none text-xs font-bold transition-colors cursor-pointer ${
                            user.active
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                          } ${!isAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          {user.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {user.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditUser(user)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fcf6eb] hover:bg-[#f5ebd6] text-[#8c5b2b] font-bold text-xs rounded-none transition-all shadow-sm uppercase tracking-wider border border-[#ded1be] cursor-pointer"
                            title="Editar usuário, permissões e senha"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-none transition-colors cursor-pointer"
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

          {/* Mobile Cards List */}
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
                        <p className="text-[10px] text-[#8c7a67] font-mono">id: {user.id}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleUserActive(user.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-none cursor-pointer ${
                        user.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {user.active ? 'Ativo' : 'Inativo'}
                    </button>
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
                        onClick={() => handleOpenEditUser(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[#8c5b2b] bg-[#fcf6eb] rounded-none border border-[#ded1be] font-bold text-xs uppercase tracking-wider cursor-pointer"
                        title="Editar permissões"
                      >
                        <Edit2 size={13} /> Editar
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-1.5 text-rose-700 bg-rose-50 border border-rose-200 rounded-none uppercase tracking-wider cursor-pointer"
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
        </div>
      )}

      {/* Modal Criar / Editar Usuário */}
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
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-none hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4a3b] mb-1">Nome Completo / Usuário: *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="ex: Carlos Silva"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#fcfaf7] border border-[#ded6c7] rounded-none focus:bg-white focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] focus:outline-none font-bold text-[#17100b]"
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
                    className="px-4 py-2 text-xs font-bold text-[#5c4a3b] bg-[#f7f3eb] hover:bg-[#ede3d3] border border-[#ded6c7] rounded-none uppercase tracking-wider cursor-pointer"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={savingUser}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#8c5b2b] hover:bg-[#a66d35] text-white font-bold text-xs rounded-none shadow-sm uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {savingUser ? 'Salvando...' : (editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete User */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={`Remover usuário "${deleteTarget?.name}"?`}
        description="Esta conta deixará de ter acesso ao painel de administração da Amadeireira."
        confirmText="Sim, Remover Usuário"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-none animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
