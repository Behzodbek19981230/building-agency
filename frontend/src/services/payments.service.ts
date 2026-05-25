import api from './api';

export const paymentsService = {
  initiate: (projectId: string) =>
    api.post(`/payments/project/${projectId}/initiate`),

  release: (paymentId: string) =>
    api.patch(`/payments/${paymentId}/release`),

  getMy: () => api.get('/payments/my'),
};
