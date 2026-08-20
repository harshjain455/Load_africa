import api from './api';

export const plantService = {
  getDashboard: async () => {
    const response = await api.get('/plant/dashboard');
    return response.data;
  },

  submitCompliance: async (data) => {
    const response = await api.post('/plant/compliance/submit', data);
    return response.data;
  },

  addMachine: async (data) => {
    const response = await api.post('/plant/machines', data);
    return response.data;
  },

  getMachines: async () => {
    const response = await api.get('/plant/machines');
    return response.data;
  },

  getPublicMachines: async () => {
    const response = await api.get('/plant/machines/public');
    return response.data;
  },

  acceptHireRequest: async (requestId, data) => {
    const response = await api.post(`/plant/hire-requests/${requestId}/accept`, data);
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get('/finance/wallet');
    return response.data;
  },

  withdrawEarnings: async (amount) => {
    const response = await api.post('/finance/withdraw', { amount });
    return response.data;
  },

  rejectHireRequest: async (requestId) => {
    const response = await api.post(`/plant/hire-requests/${requestId}/reject`);
    return response.data;
  },

  getOperators: async () => {
    const response = await api.get('/plant/operators');
    return response.data;
  },

  addOperator: async (data) => {
    const response = await api.post('/plant/operators', data);
    return response.data;
  },

  deleteOperator: async (id) => {
    const response = await api.delete(`/plant/operators/${id}`);
    return response.data;
  }
};
