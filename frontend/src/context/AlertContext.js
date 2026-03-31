import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

const AlertContext = createContext();

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload, loading: false };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'RESOLVE_ALERT':
      return { ...state, alerts: state.alerts.filter(a => a.id !== action.payload) };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AlertProvider = ({ children }) => {
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

  const resolveAlert = async (alertId) => {
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

export const useAlerts = () => useContext(AlertContext);