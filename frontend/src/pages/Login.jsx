import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography,
  Box, Divider, Alert, CircularProgress, Grid
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => { authService.googleLogin(); };
  const handleGitHubLogin = () => { authService.githubLogin(); };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#0B0F1A',
        background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)',
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
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Sign in to the Smart Retail Intelligence Platform
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
            <TextField 
              fullWidth 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              margin="normal" 
              required 
              autoComplete="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                },
              }}
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              margin="normal" 
              required 
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                },
              }}
            />
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.06)' } }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<GoogleIcon />} 
                onClick={handleGoogleLogin} 
                sx={{ 
                  height: 52, 
                  borderRadius: '14px',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: '#9CA3AF',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    bgcolor: 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                Google
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<GitHubIcon />} 
                onClick={handleGitHubLogin} 
                sx={{ 
                  height: 52, 
                  borderRadius: '14px',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: '#9CA3AF',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    bgcolor: 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                GitHub
              </Button>
            </Grid>
          </Grid>

          <Typography align="center" variant="body2" sx={{ mt: 4, color: '#64748B' }}>
            New to Smart Retail?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#818CF8', 
                textDecoration: 'none', 
                fontWeight: 700 
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;