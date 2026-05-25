import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),

  getUsers: (params: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get('/admin/users', { params }),

  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),

  getPendingWorkers: () => api.get('/admin/workers/pending'),

  verifyWorker: (id: string, status: 'VERIFIED' | 'REJECTED', reason?: string) =>
    api.patch(`/admin/workers/${id}/verify`, { status, reason }),

  getAllDisputes: (status?: string) =>
    api.get('/disputes', { params: status ? { status } : {} }),

  resolveDispute: (id: string, resolution: string) =>
    api.patch(`/admin/disputes/${id}/resolve`, { resolution }),

  getAnalytics: (period?: 'week' | 'month' | 'year') =>
    api.get('/admin/analytics', { params: period ? { period } : {} }),

  getAllProjects: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/projects', { params }),

  assignWorkerToProject: (projectId: string, workerUserId: string, finalPrice?: number) =>
    api.patch(`/admin/projects/${projectId}/assign`, { workerUserId, finalPrice }),

  searchWorkers: (search?: string) =>
    api.get('/workers', { params: { search, limit: 20, page: 1 } }),
};
