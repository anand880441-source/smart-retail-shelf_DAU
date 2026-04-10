import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Alert {
  id?: string;
  _id?: string;
  type: string;
  severity: string;
  status: string;
  message: string;
  timestamp: string;
}

interface AlertStats {
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
  total_revenue?: number;
}

interface AlertState {
  alerts: Alert[];
  stats: AlertStats;
  loading: boolean;
}

interface AlertContextType extends AlertState {
  resolveAlert: (alertId: string) => Promise<void>;
  fetchAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertAction = 
  | { type: 'SET_ALERTS'; payload: Alert[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'RESOLVE_ALERT'; payload: string }
  | { type: 'SET_STATS'; payload: AlertStats }
  | { type: 'SET_LOADING'; payload: boolean };

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload, loading: false };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'RESOLVE_ALERT':
      return { ...state, alerts: state.alerts.filter(a => (a.id || a._id) !== action.payload) };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { alerts: [], stats: {}, loading: true });

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await api.get('/alerts/active');
      dispatch({ type: 'SET_ALERTS', payload: response.data });
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      dispatch({ type: 'SET_ALERTS', payload: [] });
    }
    try {
      const statsResponse = await api.get('/alerts/stats');
      dispatch({ type: 'SET_STATS', payload: statsResponse.data });
    } catch (err) {
      console.error('Failed to fetch alert stats:', err);
    }
  }, []);

  const resolveAlert = async (alertId: string) => {
    if (!alertId) {
      console.error('resolveAlert called with undefined alertId');
      return;
    }
    try {
      await api.put(`/alerts/${alertId}`, { status: 'resolved' });
      dispatch({ type: 'RESOLVE_ALERT', payload: alertId });
      fetchAlerts();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <AlertContext.Provider value={{ ...state, resolveAlert, fetchAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};