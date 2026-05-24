import api from './api';
import { AuthTokens } from '@/types';

export const authService = {
  register: (data: {
    firstName: string; lastName: string; email: string;
    phone?: string; password: string; role: string;
  }) => api.post<{ data: { message: string } }>('/auth/register', data),

  login: (email: string, password: string) =>
    api.post<{ data: AuthTokens }>('/auth/login', { email, password }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  refresh: (refreshToken: string) =>
    api.post<{ data: AuthTokens }>('/auth/refresh', { refreshToken }),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  getMe: () => api.get('/auth/me'),
};
