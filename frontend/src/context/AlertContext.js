import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

  const fetchAlerts = async () => {
    const response = await api.get('/alerts/active');
    dispatch({ type: 'SET_ALERTS', payload: response.data });
    const statsResponse = await api.get('/alerts/stats');
    dispatch({ type: 'SET_STATS', payload: statsResponse.data });
  };

  const resolveAlert = async (alertId) => {
    await api.put(`/alerts/${alertId}`, { status: 'resolved' });
    dispatch({ type: 'RESOLVE_ALERT', payload: alertId });
    fetchAlerts();
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <AlertContext.Provider value={{ ...state, resolveAlert, fetchAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);