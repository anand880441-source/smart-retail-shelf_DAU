import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography,
  Box, Alert, CircularProgress, MenuItem, Grid
} from '@mui/material';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'associate' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Store Manager' },
    { value: 'associate', label: 'Store Associate' }
  ];

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 800 }}>Smart Retail</Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>Create your account</Typography>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required /></Grid>
              <Grid item xs={12}>
                <TextField fullWidth select label="Role" name="role" value={formData.role} onChange={handleChange}>
                  {roles.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ mt: 4, mb: 2, height: 50, fontSize: '1rem', borderRadius: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
            </Button>
          </form>
          <Typography align="center" variant="body2" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Sign in instead</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;