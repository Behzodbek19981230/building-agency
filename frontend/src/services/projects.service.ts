import api from './api';
import { Project, ApiResponse, PaginationMeta } from '@/types';

export const projectsService = {
  create: (data: FormData) =>
    api.post<ApiResponse<Project>>('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: (params?: Record<string, any>) =>
    api.get<{ data: Project[]; meta: PaginationMeta }>('/projects', { params }),

  getOne: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),

  getMy: (status?: string) =>
    api.get<ApiResponse<Project[]>>('/projects/my', { params: { status } }),

  update: (id: string, data: Partial<Project>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),

  assignWorker: (projectId: string, workerId: string, bidId: string) =>
    api.patch(`/projects/${projectId}/assign/${workerId}`, { bidId }),

  complete: (id: string) =>
    api.patch(`/projects/${id}/complete`),

  cancel: (id: string) =>
    api.patch(`/projects/${id}/cancel`),
};
