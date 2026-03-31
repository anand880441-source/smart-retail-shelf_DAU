import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Button, Divider, Alert, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import PersonIcon from '@mui/icons-material/Person';
import { authService } from '../services/api';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    localStorage.setItem('notifications_enabled', notifications);
    localStorage.setItem('dark_mode', darkMode);
    localStorage.setItem('email_alerts', emailAlerts);
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const glassCard = {
    borderRadius: '20px',
    background: 'rgba(30, 41, 59, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    mb: 3
  };

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          Manage your account preferences and notifications.
        </Typography>
      </Box>

      {success && <Alert severity="success" variant="outlined" sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={glassCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}><NotificationsIcon /></Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />
              <FormControlLabel control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} color="primary" />} label="Push Notifications" sx={{ display: 'block', mb: 1 }} />
              <FormControlLabel control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />} label="Email Alerts" sx={{ display: 'block' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={glassCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}><PaletteIcon /></Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Appearance</Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />
              <FormControlLabel control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} color="primary" />} label="Dark Mode (Premium)" sx={{ display: 'block' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={glassCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.main' }}><PersonIcon /></Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Account</Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />
              <Button variant="outlined" color="error" onClick={() => authService.logout()} sx={{ borderRadius: '12px' }}>Logout</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleSave} 
        sx={{ 
          mt: 2, 
          height: 56, 
          borderRadius: '14px', 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', 
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.39)',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)' }
        }}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default SettingsPage;