import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ critical: 0, high: 0, medium: 0, low: 0 });

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await api.get('/alerts/active');
      setAlerts(response.data);
      const statsResponse = await api.get('/alerts/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveAlert = useCallback(async (alertId) => {
    await api.put(`/alerts/${alertId}`, { status: 'resolved' });
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, stats, resolveAlert, refreshAlerts: fetchAlerts };
};