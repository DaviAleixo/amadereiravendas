import { INITIAL_USERS, User, UserRole } from '@/data/mockAdminData';

const USERS_STORAGE_KEY = 'amadeireira_admin_users_v1';
const AUTH_STORAGE_KEY = 'amadeireira_admin_auth_user_v1';

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
    return getStoredUsers();
  },

  async create(userData: { name: string; email: string; role: UserRole }): Promise<User> {
    const users = getStoredUsers();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      active: true,
      lastActivity: 'Nunca',
      createdAt: new Date().toISOString()
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    return newUser;
  },

  async toggleActive(id: string): Promise<User | null> {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index].active = !users[index].active;
    saveUsers(users);
    return users[index];
  },

  async delete(id: string): Promise<boolean> {
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
    if (!saved) return INITIAL_USERS[0]; // default logged in as Admin for easy testing
    try {
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_USERS[0];
    }
  },

  login(email: string, pass: string): { success: boolean; user?: User; error?: string } {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Usuário não encontrado.' };
    }
    if (!user.active) {
      return { success: false, error: 'Esta conta de usuário está desativada.' };
    }
    // Simple mock password check (any pass >= 4 chars or 'admin123')
    if (!pass || pass.length < 4) {
      return { success: false, error: 'Senha inválida ou muito curta.' };
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
