import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Switch, FormControlLabel, Button, TextField, Divider, Alert } from '@mui/material';
import { authService } from '../services/api';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    localStorage.setItem('notifications_enabled', notifications);
    localStorage.setItem('dark_mode', darkMode);
    localStorage.setItem('email_alerts', emailAlerts);
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>⚙️ Settings</Typography>
        
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />} label="Push Notifications" />
            <FormControlLabel control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />} label="Email Alerts" />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Appearance</Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />} label="Dark Mode" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Account</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="contained" color="error" onClick={() => authService.logout()}>Logout</Button>
          </CardContent>
        </Card>

        <Button fullWidth variant="contained" onClick={handleSave} sx={{ mt: 3, bgcolor: '#2563EB' }}>Save Settings</Button>
      </Container>
    </Box>
  );
};

export default SettingsPage;