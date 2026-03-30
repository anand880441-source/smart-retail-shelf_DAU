import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('access_token', token);
      // Fetch user info
      fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/dashboard');
        })
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default OAuthCallback;