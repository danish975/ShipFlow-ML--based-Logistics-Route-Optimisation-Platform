import { api } from './api';

export const AuthService = {
  async register(data: any) {
    const res = await api.post('/api/v1/auth/register', data);
    return res.data;
  },

  async login(data: any) {
    const res = await api.post('/api/v1/auth/login', data);
    return res.data;
  },

  async logout() {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
  },

  async getProfile() {
    const res = await api.get('/api/v1/auth/profile');
    return res.data;
  }
};
