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
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'associate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Store Manager' },
    { value: 'associate', label: 'Store Associate' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      // Auto login after registration
      const loginResponse = await authService.login(formData.email, formData.password);
      localStorage.setItem('access_token', loginResponse.data.access_token);
      const userResponse = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'white' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#2563EB', fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Register for Smart Retail Shelf
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: '#2563EB', height: 48 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>

          <Typography align="center" variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none' }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;