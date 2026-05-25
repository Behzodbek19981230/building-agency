import api from './api';

export const bidsService = {
  create: (projectId: string, data: { amount: number; message: string; duration?: number; durationUnit?: string }) =>
    api.post(`/bids/project/${projectId}`, data),

  getMy: () => api.get('/bids/my'),

  update: (bidId: string, data: Partial<{ amount: number; message: string; duration?: number }>) =>
    api.put(`/bids/${bidId}`, data),

  withdraw: (bidId: string) => api.delete(`/bids/${bidId}`),

  getProjectBids: (projectId: string) => api.get(`/bids/project/${projectId}`),
};
