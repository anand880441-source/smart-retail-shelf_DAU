import api from './api';

export const alertService = {
  getActiveAlerts: () => api.get('/alerts/active'),
  getAllAlerts: (limit = 100) => api.get(`/alerts/all?limit=${limit}`),
  getAlertStats: () => api.get('/alerts/stats'),
  resolveAlert: (alertId) => api.put(`/alerts/${alertId}`, { status: 'resolved' }),
  createAlert: (alertData) => api.post('/alerts', alertData)
};