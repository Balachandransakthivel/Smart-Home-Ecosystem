import api from './api';

export default {
  getInventory: () => api.get('/inventory'),
  addInventory: (data: any) => api.post('/inventory', data),
  updateInventory: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  deleteInventory: (id: string) => api.delete(`/inventory/${id}`)
};
