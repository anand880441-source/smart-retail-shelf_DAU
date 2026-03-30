import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    const userResponse = await authService.getMe();
    localStorage.setItem('user', JSON.stringify(userResponse.data));
    setUser(userResponse.data);
    navigate('/dashboard');
    return userResponse.data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return { user, loading, login, logout };
};