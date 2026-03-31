import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography,
  Box, Alert, CircularProgress, MenuItem, Grid
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: 'rgba(255,255,255,0.02)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
    },
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#0B0F1A',
        background: 'radial-gradient(circle at 70% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              p: 2, 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              mb: 3
            }}
          >
            <StorefrontIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Get Started
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Create your Smart Retail Intelligence account
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            borderRadius: '24px', 
            bgcolor: 'rgba(17, 24, 39, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              variant="outlined"
              sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required sx={inputSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required sx={inputSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required sx={inputSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  select 
                  label="Role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  sx={inputSx}
                >
                  {roles.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              disabled={loading} 
              sx={{ 
                mt: 4, 
                mb: 2, 
                height: 56, 
                fontSize: '1rem', 
                borderRadius: '14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                letterSpacing: '0.02em',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Typography align="center" variant="body2" sx={{ mt: 3, color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 700 }}>
              Sign in instead
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;