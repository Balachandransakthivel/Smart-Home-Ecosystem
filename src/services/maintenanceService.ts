import api from './api';

export default {
  getMaintenanceTasks: () => api.get('/maintenance'),
  createMaintenanceTask: (data: any) => api.post('/maintenance', data),
  updateMaintenanceTask: (id: string, data: any) => api.put(`/maintenance/${id}`, data),
  deleteMaintenanceTask: (id: string) => api.delete(`/maintenance/${id}`)
};
