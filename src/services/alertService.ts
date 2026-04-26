import api from './api';
export default {
  getAlerts: () => api.get('/alerts'),
  markRead: (id: string) => api.put(`/alerts/${id}/read`),
  markAllRead: () => api.put('/alerts/read-all')
};
