import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Tabs, Tab, 
  Badge, CircularProgress, Paper, Alert as MuiAlert, 
  Snackbar, Button 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import AlertCard from '../components/common/Cards/AlertCard';
import MetricCard from '../components/common/Cards/MetricCard';
import { useAlerts } from '../context/AlertContext';
import websocketService from '../services/websocketService';
import { alertService } from '../services/api';

const AlertsPage = () => {
  const { alerts, stats, loading, fetchAlerts, resolveAlert } = useAlerts();
  const [tabValue, setTabValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Connect WebSocket for real-time updates
  useEffect(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/ws/alerts`;
    websocketService.connect(wsUrl);

    const handleNewAlert = (data) => {
      if (data.type === 'new_alert') {
        fetchAlerts(); // Refresh global alert state
        setSnackbar({ 
          open: true, 
          message: `New Alert: ${data.alert.title}`, 
          severity: data.alert.priority === 'critical' ? 'error' : 'warning' 
        });
      }
    };

    websocketService.addListener(handleNewAlert);

    return () => {
      websocketService.removeListener(handleNewAlert);
      websocketService.disconnect();
    };
  }, [fetchAlerts]);

  const handleTabChange = async (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      setHistoryLoading(true);
      try {
        const response = await alertService.getAlerts({ status: 'resolved' });
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch alert history:", err);
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const activeAlertsCount = alerts?.length || 0;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Alert Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage real-time shelf alerts and stockout notifications.
          </Typography>
        </Box>
        <Badge badgeContent={activeAlertsCount} color="error" overlap="circular">
          <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Badge>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <MetricCard 
            title="Critical" 
            value={stats?.critical || 0} 
            color="#EF4444" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <MetricCard 
            title="High" 
            value={stats?.high || 0} 
            color="#F97316" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <MetricCard 
            title="Medium" 
            value={stats?.medium || 0} 
            color="#F59E0B" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <MetricCard 
            title="Low" 
            value={stats?.low || 0} 
            color="#10B981" 
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard 
            title="Revenue at Risk" 
            value={`$${stats?.total_revenue?.toLocaleString() || 0}`} 
            color="#2563EB"
            subtitle="Potential daily loss"
          />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="alert tabs">
          <Tab icon={<NotificationsIcon sx={{ mr: 1 }} />} iconPosition="start" label={`Active Alerts (${activeAlertsCount})`} />
          <Tab icon={<HistoryIcon sx={{ mr: 1 }} />} iconPosition="start" label="Alert History" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : alerts.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6">All Clear!</Typography>
              <Typography color="text.secondary">No active alerts at the moment.</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchAlerts}>Refresh</Button>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {alerts.map((alert, idx) => (
                <Grid item xs={12} key={alert.id || alert._id || idx}>
                  <AlertCard alert={alert} onResolve={resolveAlert} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6">No History</Typography>
              <Typography color="text.secondary">Resolved alerts will appear here.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {history.map((alert, idx) => (
                <Grid item xs={12} key={alert.id || alert._id || idx}>
                  <AlertCard alert={alert} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', boxShadow: 3 }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AlertsPage;