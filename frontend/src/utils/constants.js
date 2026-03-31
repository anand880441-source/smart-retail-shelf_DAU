export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

if (process.env.NODE_ENV === 'production') {
  console.log('--- FRONTEND CONFIG ---');
  console.log('API_URL:', API_URL);
  console.log('WS_URL:', WS_URL);
  console.log('-----------------------');
}

export const PRIORITY_COLORS = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#10B981'
};

export const ALERT_TYPES = {
  stockout: 'Stockout',
  low_stock: 'Low Stock',
  planogram_violation: 'Planogram Violation'
};

export const PRODUCT_CATEGORIES = ['Dairy', 'Bakery', 'Produce', 'Snacks', 'Eggs'];