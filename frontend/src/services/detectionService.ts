import api from './api';

export const detectionService = {
  analyzeImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/detection/analyze-shelf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getProductDetails: (sku) => api.get(`/detection/product/${sku}`)
};