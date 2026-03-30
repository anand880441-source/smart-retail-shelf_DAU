import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('access_token', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, setToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;