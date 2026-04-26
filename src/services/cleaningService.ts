import api from './api';
export default {
  getCleanings: () => api.get('/cleaning'),
  createCleaning: (data: any) => api.post('/cleaning', data),
  updateCleaning: (id: string, data: any) => api.put(`/cleaning/${id}`, data),
  deleteCleaning: (id: string) => api.delete(`/cleaning/${id}`)
};
