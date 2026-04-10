import api from './api';

export const forecastService = {
  getDemandForecast: (productSku, days = 30) => api.get(`/forecasting/demand?product_sku=${productSku}&days=${days}`),
  getReorderPoint: (productSku, leadTimeDays = 3) => api.get(`/forecasting/reorder-point?product_sku=${productSku}&lead_time_days=${leadTimeDays}`)
};