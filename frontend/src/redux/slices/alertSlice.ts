import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  stats: { critical: 0, high: 0, medium: 0, low: 0, total_revenue: 0 },
  loading: false
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
      state.loading = false;
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
    },
    resolveAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setAlerts, addAlert, resolveAlert, setStats, setLoading } = alertSlice.actions;
export default alertSlice.reducer;