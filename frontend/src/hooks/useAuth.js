// filepath: c:\Users\Sarthak\Downloads\project\frontend\src\hooks\useAuth.jsx

import { create } from 'zustand';
import axios from '../config/axios';
import { jwtDecode } from 'jwt-decode';

const useAuth = create((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token, user } = response.data;

      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error('Token has expired');
      }

      localStorage.setItem('token', token);
      set({ user, loading: false });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false, user: null });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, error: null });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    const token = localStorage.getItem('token');

    if (!token) {
      set({ user: null, loading: false, initialized: true });
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error('Token has expired');
      }

      const response = await axios.get('/api/auth/profile');
      set({ user: response.data, error: null, loading: false, initialized: true });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, error: 'Session expired. Please login again.', loading: false, initialized: true });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  updateUser: (userData) => set({ user: { ...userData } }),
}));

export { useAuth };
