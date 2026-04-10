export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'stockout' | 'low_stock' | 'planogram_violation' | 'price_mismatch' | 'unauthorized_product';
export type StockLevel = 'full' | 'low' | 'empty' | 'overstock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  type: AlertType;
  location: string;
  product?: string;
  revenueImpact: number;
  timestamp: string;
  acknowledged: boolean;
  channels: string[];
  suggestedAction: string;
}

export interface ShelfSection {
  id: string;
  name: string;
  aisle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stockLevel: StockLevel;
  healthScore: number;
  alerts: number;
  products: number;
}

export interface ShelfDetection {
  id: string;
  shelfId: string;
  product: Product;
  stockLevel: StockLevel;
  facings: number;
  expectedFacings: number;
  confidence: number;
  position: { x: number; y: number; width: number; height: number };
  compliant: boolean;
  timestamp: string;
}

export interface DemandForecast {
  productId: string;
  date: string;
  predictedDemand: number;
  actualDemand?: number;
  reorderPoint: number;
  suggestedQuantity: number;
}

export interface StoreMetrics {
  shelfHealthScore: number;
  inStockRate: number;
  planogramCompliance: number;
  revenueRecovered: number;
  avgReplenishmentTime: number;
  forecastAccuracy: number;
  alertsToday: number;
}

export interface DetectionMetrics {
  mAP: number;
  skuAccuracy: number;
  inferenceTime: number;
  falsePositiveRate: number;
  framesProcessed: number;
  camerasOnline: number;
  camerasTotal: number;
}
