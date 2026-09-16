import { INITIAL_USERS, User, UserRole, AdminTabId } from '@/data/mockAdminData';
import { supabase } from '@/lib/supabase';

const USERS_STORAGE_KEY = 'amadeireira_admin_users_v3';
const AUTH_STORAGE_KEY = 'amadeireira_admin_auth_user_v2';

export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_amadeireira_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback
  return btoa(password + '_amadeireira_salt_2026');
}

function mapFromSupabase(row: any): User {
  let hash = '';
  if (row.password_hash) {
    hash = row.password_hash;
  } else if (row.email && typeof row.email === 'string') {
    if (row.email.startsWith('hash:')) {
      hash = row.email.replace('hash:', '');
    } else if (!row.email.includes('@')) {
      hash = row.email;
    }
  }

  return {
    id: row.id,
    name: row.name,
    passwordHash: hash,
    role: row.role as UserRole,
    active: row.active ?? true,
    allowedTabs: Array.isArray(row.allowed_tabs) ? row.allowed_tabs : ['dashboard', 'produtos', 'categorias'],
    lastActivity: row.last_activity || 'Nunca',
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapToSupabase(u: Partial<User>) {
  const row: any = {};
  if (u.id !== undefined) row.id = u.id;
  if (u.name !== undefined) row.name = u.name;
  if (u.passwordHash !== undefined) {
    row.email = u.passwordHash ? (u.passwordHash.startsWith('hash:') ? u.passwordHash : `hash:${u.passwordHash}`) : '';
  }
  if (u.role !== undefined) row.role = u.role;
  if (u.active !== undefined) row.active = u.active;
  if (u.allowedTabs !== undefined) row.allowed_tabs = u.allowedTabs;
  if (u.lastActivity !== undefined) row.last_activity = u.lastActivity;
  if (u.createdAt !== undefined) row.created_at = u.createdAt;
  return row;
}

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUsers(users: User[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

export const userService = {
  async getAll(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapFromSupabase);
        saveUsers(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Falha ao buscar usuários no Supabase, usando cache local:', e);
    }
    return getStoredUsers();
  },

  async create(userData: { name: string; password?: string; passwordHash?: string; role: UserRole; allowedTabs?: AdminTabId[] }): Promise<User> {
    const users = await this.getAll();
    const hashedPassword = userData.password ? await hashPassword(userData.password) : (userData.passwordHash || '');
    
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      passwordHash: hashedPassword,
      role: userData.role,
      allowedTabs: userData.role === 'ADMINISTRADOR'
        ? ['dashboard', 'produtos', 'categorias', 'live', 'usuarios', 'configuracoes']
        : userData.allowedTabs || ['dashboard', 'produtos', 'categorias'],
      active: true,
      lastActivity: 'Nunca',
      createdAt: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('admin_users').insert(mapToSupabase(newUser));
      if (error) console.error('Erro ao criar usuário no Supabase:', error);
    } catch (e) {
      console.warn('Falha de rede ao criar usuário no Supabase:', e);
    }

    const updated = [...users, newUser];
    saveUsers(updated);
    return newUser;
  },

  async update(id: string, userData: Partial<User> & { password?: string }): Promise<User | null> {
    const patchData: Partial<User> = { ...userData };
    if (userData.password) {
      patchData.passwordHash = await hashPassword(userData.password);
      delete (patchData as any).password;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update(mapToSupabase(patchData))
        .eq('id', id);

      if (error) console.error('Erro ao atualizar usuário no Supabase:', error);
    } catch (e) {
      console.warn('Falha de rede ao atualizar usuário no Supabase:', e);
    }

    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...patchData
    };
    saveUsers(users);
    return users[index];
  },

  async toggleActive(id: string): Promise<User | null> {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    return this.update(id, { active: !users[index].active });
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) console.error('Erro ao deletar usuário no Supabase:', error);
    } catch (e) {
      console.warn('Falha de rede ao deletar usuário no Supabase:', e);
    }

    const users = getStoredUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    saveUsers(filtered);
    return true;
  }
};

export const authService = {
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return INITIAL_USERS[0];
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return INITIAL_USERS[0];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_USERS[0];
    }
  },

  async login(username: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = await userService.getAll();
    const cleanUsername = (username || '').trim().toLowerCase();
    
    // Accept strictly username (name)
    const user = users.find(u => u.name.trim().toLowerCase() === cleanUsername);
    
    if (!user) {
      return { success: false, error: 'Nome de usuário não encontrado.' };
    }
    if (!user.active) {
      return { success: false, error: 'Esta conta de usuário está desativada.' };
    }
    if (!pass) {
      return { success: false, error: 'Por favor, informe a senha de acesso.' };
    }

    const inputHash = await hashPassword(pass);

    // Check encrypted hash with fallback for initial seed accounts
    const isPasswordValid = 
      (user.passwordHash && user.passwordHash === inputHash) ||
      (!user.passwordHash && (pass === 'admin123' || pass === 'admin')) ||
      (user.passwordHash === pass);

    if (!isPasswordValid) {
      return { success: false, error: 'Senha incorreta. Tente novamente.' };
    }

    // Auto migrate user password to cryptographic hash if needed
    if (!user.passwordHash || user.passwordHash === pass) {
      userService.update(user.id, { passwordHash: inputHash });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return { success: true, user };
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
};
