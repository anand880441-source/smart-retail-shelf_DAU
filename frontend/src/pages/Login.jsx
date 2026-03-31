import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography,
  Box, Divider, Alert, CircularProgress, Grid
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 800 }}>Smart Retail</Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>Sign in to your account</Typography>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required autoComplete="email" />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required autoComplete="current-password" />
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, height: 50, fontSize: '1rem', borderRadius: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>
          <Divider sx={{ my: 3 }}><Typography variant="body2" color="text.secondary">OR CONTINUE WITH</Typography></Divider>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin} sx={{ height: 48, borderRadius: 2 }}>Google</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<GitHubIcon />} onClick={handleGitHubLogin} sx={{ height: 48, borderRadius: 2 }}>GitHub</Button>
            </Grid>
          </Grid>
          <Typography align="center" variant="body2" sx={{ mt: 4 }}>
            New to Smart Retail?{' '}
            <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;