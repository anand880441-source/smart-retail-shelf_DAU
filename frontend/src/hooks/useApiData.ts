import { useState, useEffect, useCallback } from 'react';
import { 
  mockAlerts, 
  storeMetrics, 
  shelfSections, 
  shelfDetections, 
  planogramViolations 
} from '../data/mockData';
import { Alert, StoreMetrics, ShelfSection, AlertPriority, AlertType } from '../types';

// Generic data fetching hook
export function useApiData<T>(apiFn: () => Promise<T>, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiFn();
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks used by the provided components
export function useAlerts() {
  const [data, setData] = useState<Alert[]>(mockAlerts);
  const [loading, setLoading] = useState(false);

  const refetch = () => {
    // In a real app, this would fetch from API
    setData([...mockAlerts]);
  };

  return { data, loading, refetch, isLive: false };
}

export function useDashboardStats() {
  return { 
    data: storeMetrics, 
    loading: false, 
    isLive: false 
  };
}

export function useRecentAlerts(limit: number = 4) {
  return { 
    data: mockAlerts.slice(0, limit), 
    loading: false 
  };
}

export function useAnalytics() {
  return { 
    data: {}, 
    loading: false 
  };
}

export function useCameras() {
  return { 
    data: Array.from({ length: 8 }, (_, i) => ({ id: `C${i+1}`, status: 'online' })), 
    loading: false 
  };
}

export function usePlanograms() {
  const mockPlanograms = [
    { aisleId: 'A1', aisleName: 'Aisle 1 - Dairy', overallScore: 92, compliantProducts: 42, totalProducts: 45, sectionScores: [{ section: 'Cooler 1', score: 95 }, { section: 'Cooler 2', score: 88 }] },
    { aisleId: 'A2', aisleName: 'Aisle 2 - Bakery', overallScore: 88, compliantProducts: 25, totalProducts: 28, sectionScores: [{ section: 'Bread', score: 90 }, { section: 'Pastries', score: 85 }] },
    { aisleId: 'A3', aisleName: 'Aisle 3 - Meat', overallScore: 64, compliantProducts: 35, totalProducts: 54, sectionScores: [{ section: 'Poultry', score: 70 }, { section: 'Beef', score: 58 }] },
  ];
  return { 
    data: mockPlanograms, 
    loading: false 
  };
}
