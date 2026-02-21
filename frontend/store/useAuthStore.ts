import { create } from 'zustand';
import { authService } from '@/services/api';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUser: (user: any) => void;
  checkAuth: (pathname: string, router: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: true,
  
  login: (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    set({ token: newToken, user: newUser, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, loading: false });
  },

  updateUser: (updatedUser: any) => {
    set({ user: updatedUser });
  },

  checkAuth: async (pathname: string, router: any) => {
    const publicRoutes = ['/', '/login', '/signup'];
    const { token } = get();

    if (!token) {
      set({ loading: false });
      if (!publicRoutes.includes(pathname)) {
        router.push('/login');
      }
      return;
    }

    try {
      const { data } = await authService.getMe();
      set({ user: data, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, user: null, loading: false });
      if (!publicRoutes.includes(pathname)) {
        router.push('/login');
      }
    }
  },
}));
