import { Alert, ShelfSection, ShelfDetection, DemandForecast, StoreMetrics, DetectionMetrics, Product } from '../types';

export const products: Product[] = [
  { id: '1', sku: 'BV-7721', name: 'Fresh Milk 1L', category: 'Dairy', price: 2.99 },
  { id: '2', sku: 'BV-8832', name: 'Greek Yogurt 500g', category: 'Dairy', price: 4.50 },
  { id: '3', sku: 'BK-1102', name: 'Whole Wheat Bread', category: 'Bakery', price: 3.25 },
  { id: '4', sku: 'BK-2291', name: 'Butter Croissant', category: 'Bakery', price: 1.80 },
  { id: '5', sku: 'PN-4401', name: 'Organic Bananas', category: 'Produce', price: 0.89 },
  { id: '6', sku: 'PN-5512', name: 'Red Apples 1kg', category: 'Produce', price: 5.40 },
  { id: '7', sku: 'MT-1205', name: 'Chicken Breast 500g', category: 'Meat', price: 7.50 },
  { id: '8', sku: 'MT-3310', name: 'Ground Beef 500g', category: 'Meat', price: 6.80 },
];

export const storeMetrics: StoreMetrics = {
  shelfHealthScore: 92,
  inStockRate: 98.4,
  planogramCompliance: 89,
  revenueRecovered: 14250,
  avgReplenishmentTime: 18,
  forecastAccuracy: 94.2,
  alertsToday: 12,
};

export const detectionMetrics: DetectionMetrics = {
  mAP: 0.912,
  skuAccuracy: 0.965,
  inferenceTime: 42,
  falsePositiveRate: 0.021,
  framesProcessed: 1284500,
  camerasOnline: 24,
  camerasTotal: 24,
};

export const shelfSections: ShelfSection[] = [
  { id: 'A1-S1', name: 'Dairy Coolers', aisle: 'Aisle 1', x: 5, y: 10, width: 18, height: 12, stockLevel: 'full', healthScore: 96, alerts: 0, products: 45 },
  { id: 'A1-S2', name: 'Cheese Section', aisle: 'Aisle 1', x: 5, y: 24, width: 18, height: 8, stockLevel: 'low', healthScore: 78, alerts: 1, products: 32 },
  { id: 'A2-S1', name: 'Fresh Bakery', aisle: 'Aisle 2', x: 28, y: 10, width: 18, height: 15, stockLevel: 'full', healthScore: 92, alerts: 0, products: 28 },
  { id: 'A3-S1', name: 'Meat & Poultry', aisle: 'Aisle 3', x: 51, y: 10, width: 18, height: 20, stockLevel: 'empty', healthScore: 64, alerts: 2, products: 54 },
  { id: 'A4-S1', name: 'Organic Produce', aisle: 'Aisle 4', x: 74, y: 10, width: 18, height: 25, stockLevel: 'full', healthScore: 98, alerts: 0, products: 62 },
];

export const complianceTrend = [
  { date: '2024-03-24', compliance: 82, target: 90 },
  { date: '2024-03-25', compliance: 85, target: 90 },
  { date: '2024-03-26', compliance: 84, target: 90 },
  { date: '2024-03-27', compliance: 88, target: 90 },
  { date: '2024-03-28', compliance: 89, target: 90 },
  { date: '2024-03-29', compliance: 87, target: 90 },
  { date: '2024-03-30', compliance: 90, target: 90 },
];

export const stockoutTrend = [
  { date: '2024-03-24', stockouts: 22, resolved: 18, avgTime: 25 },
  { date: '2024-03-25', stockouts: 18, resolved: 16, avgTime: 22 },
  { date: '2024-03-26', stockouts: 15, resolved: 15, avgTime: 18 },
  { date: '2024-03-27', stockouts: 25, resolved: 20, avgTime: 28 },
  { date: '2024-03-28', stockouts: 20, resolved: 19, avgTime: 21 },
  { date: '2024-03-29', stockouts: 16, resolved: 16, avgTime: 19 },
  { date: '2024-03-30', stockouts: 12, resolved: 12, avgTime: 15 },
];

export const categoryPerformance = [
  { category: 'Dairy', inStock: 98, compliance: 96, revenue: 12450 },
  { category: 'Produce', inStock: 95, compliance: 92, revenue: 18200 },
  { category: 'Bakery', inStock: 92, compliance: 90, revenue: 8400 },
  { category: 'Meat', inStock: 88, compliance: 85, revenue: 15600 },
  { category: 'Frozen', inStock: 96, compliance: 94, revenue: 9800 },
];

export const shelfDetections: ShelfDetection[] = products.map((p, i) => ({
  id: `det-${i}`,
  shelfId: i < 3 ? 'A1-S1' : i < 6 ? 'A2-S1' : 'A3-S1',
  product: p,
  stockLevel: i === 0 ? 'empty' : i < 3 ? 'low' : 'full',
  facings: i === 0 ? 0 : i < 3 ? 2 : 5,
  expectedFacings: 5,
  confidence: 0.92 + Math.random() * 0.07,
  position: { x: 10 + i * 15, y: 120, width: 80, height: 150 },
  compliant: i !== 2,
  timestamp: new Date().toISOString(),
}));

export const replenishOrders = [
  { id: 'ORD-101', product: 'Fresh Milk 1L', sku: 'BV-7721', source: 'Dairy Express', quantity: 120, status: 'in_progress', priority: 'urgent', estimatedTime: '2h 15m' },
  { id: 'ORD-102', product: 'Greek Yogurt', sku: 'BV-8832', source: 'Dairy Express', quantity: 48, status: 'pending', priority: 'high', estimatedTime: '4h 30m' },
  { id: 'ORD-103', product: 'Whole Wheat Bread', sku: 'BK-1102', source: 'Sunlight Bakery', quantity: 60, status: 'completed', priority: 'medium', estimatedTime: 'Delivered' },
];

export const planogramViolations = [
  { id: 'V-001', product: 'Fresh Milk 1L', description: 'Missing SKU in designated face', location: 'Aisle 1, Cooler 3', type: 'missing', severity: 'critical', suggestedAction: 'Replenish within 15 mins' },
  { id: 'V-002', product: 'Red Apples', description: 'Product misaligned with tag', location: 'Produce, Bin 4', type: 'misplaced', severity: 'high', suggestedAction: 'Realign product' },
];

export const generateHeatmapData = () => {
  const aisles = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'];
  const data = [];
  for (const aisle of aisles) {
    for (let hour = 8; hour <= 22; hour++) {
      data.push({
        aisle,
        hour,
        value: Math.random() * 10
      });
    }
  }
  return data;
};

export const mockAlerts: Alert[] = [
  {
    id: 'AL-1001',
    title: 'Critical Stockout: Fresh Milk 1L',
    description: 'Milk cooler at Aisle 1 Section 3 is empty. Recovery time estimate > 2 hours.',
    priority: 'critical',
    type: 'stockout',
    location: 'Aisle 1, Section 3',
    product: 'Fresh Milk 1L',
    revenueImpact: 450,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    channels: ['dashboard', 'mobile'],
    suggestedAction: 'Prioritize replenishment from stockroom A'
  },
  {
    id: 'AL-1002',
    title: 'Planogram Violation: Greek Yogurt',
    description: 'Greek Yogurt 500g is placed in the wrong shelf position.',
    priority: 'high',
    type: 'planogram_violation',
    location: 'Aisle 1, Section 4',
    product: 'Greek Yogurt 500g',
    revenueImpact: 120,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: false,
    channels: ['dashboard'],
    suggestedAction: 'Move products to position 4B'
  }
];

// Add specific exports needed by the provided components
export const replenishmentOrders = replenishOrders;
export const recentAlerts = mockAlerts;
