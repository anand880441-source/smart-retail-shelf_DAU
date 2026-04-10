import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  getMe: () => api.get('/auth/me'),
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google/login`;
  },
  githubLogin: () => {
    window.location.href = `${API_URL}/auth/github/login`;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const alertService = {
  getAlerts: (params: any) => api.get('/alerts', { params }),
  getActiveAlerts: () => api.get('/alerts/active'),
  updateAlertStatus: (id: string, status: string) => api.put(`/alerts/${id}`, { status }),
  getAlertStats: () => api.get('/alerts/stats'),
};

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getForecasts: () => api.get('/analytics/forecast'),
  getRealtimeStats: () => api.get('/analytics/realtime'),
};

export const planogramService = {
  getPlanograms: () => api.get('/planogram'),
  getPlanogram: (id: string) => api.get(`/planogram/${id}`),
  createPlanogram: (data: any) => api.post('/planogram', data),
  checkCompliance: (id: string, imageData: string) => api.post(`/planogram/${id}/check-compliance`, { image: imageData }),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getInventorySummary: () => api.get('/dashboard/inventory'),
};

export const productService = {
  getProducts: (params: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
};

export const forecastingService = {
  getDemandForecast: () => api.get('/forecasting/demand'),
  getInventoryForecast: () => api.get('/forecasting/inventory'),
};

export const inventoryService = {
  getInventory: () => api.get('/inventory'),
  updateStock: (id: string, amount: number) => api.patch(`/inventory/${id}`, { amount }),
};

export const cameraService = {
  getCameras: () => api.get('/cameras'),
  getCamera: (id: string) => api.get(`/cameras/${id}`),
  getLiveStream: (id: string) => `${API_URL}/cameras/${id}/stream`,
};

export const storeService = {
  getStores: () => api.get('/stores'),
  getStore: (id: string) => api.get(`/stores/${id}`),
  createStore: (data: any) => api.post('/stores', data),
};

export const reportService = {
  getStockoutReport: (days) => api.get('/reports/stockout', { params: { days } }),
  getComplianceReport: () => api.get('/reports/compliance'),
  getInventoryReport: () => api.get('/reports/inventory'),
  exportPDF: (reportType) => api.get(`/reports/export/pdf`, { 
    params: { report_type: reportType },
    responseType: 'blob' 
  }),
};

export default api;
export { api };