import api from './api';

export const reviewsService = {
  create: (projectId: string, revieweeId: string, data: FormData) =>
    api.post(`/reviews/project/${projectId}/user/${revieweeId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getWorkerReviews: (workerId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/worker/${workerId}`, { params }),

  getClientReviews: (clientId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/client/${clientId}`, { params }),

  getProjectReviews: (projectId: string) =>
    api.get(`/reviews/project/${projectId}`),

  getUserPublicProfile: (userId: string) =>
    api.get(`/users/${userId}/public-profile`),
};
