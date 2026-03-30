import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      const { access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      
      // Get user info
      const userResponse = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  const handleGitHubLogin = () => {
    authService.githubLogin();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'white',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#2563EB', fontWeight: 'bold' }}>
            Smart Retail Shelf
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Login to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
                height: 48,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 1, height: 48 }}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={handleGitHubLogin}
            sx={{ mb: 2, height: 48 }}
          >
            Continue with GitHub
          </Button>

          <Typography align="center" variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none' }}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;