import api from './api';
import { WorkerProfile, ApiResponse, PaginationMeta } from '@/types';

export const workersService = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ data: WorkerProfile[]; meta: PaginationMeta }>('/workers', { params }),

  getOne: (id: string) =>
    api.get<ApiResponse<WorkerProfile>>(`/workers/${id}`),

  getMyProfile: () =>
    api.get<ApiResponse<WorkerProfile>>('/workers/my/profile'),

  getStats: () =>
    api.get('/workers/my/stats'),

  createProfile: (data: any) =>
    api.post<ApiResponse<WorkerProfile>>('/workers/profile', data),

  updateProfile: (data: any) =>
    api.put<ApiResponse<WorkerProfile>>('/workers/profile', data),

  updateStatus: (status: string) =>
    api.patch('/workers/status', { status }),

  addPortfolio: (data: FormData) =>
    api.post('/workers/portfolio', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getSaved: () =>
    api.get('/workers/saved'),

  toggleSave: (workerId: string) =>
    api.post(`/workers/${workerId}/save`),
};
