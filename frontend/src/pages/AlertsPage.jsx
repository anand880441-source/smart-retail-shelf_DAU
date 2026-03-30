import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Badge,
  Alert as MuiAlert,
  Snackbar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api, { authService } from '../services/api';

const getPriorityConfig = (priority) => {
  switch(priority) {
    case 'critical': return { color: '#EF4444', icon: <ErrorIcon />, label: 'CRITICAL' };
    case 'high': return { color: '#F97316', icon: <WarningIcon />, label: 'HIGH' };
    case 'medium': return { color: '#F59E0B', icon: <InfoIcon />, label: 'MEDIUM' };
    case 'low': return { color: '#10B981', icon: <InfoIcon />, label: 'LOW' };
    default: return { color: '#6B7280', icon: <InfoIcon />, label: 'UNKNOWN' };
  }
};

const getTypeConfig = (type) => {
  switch(type) {
    case 'stockout': return { label: 'Stockout', bgColor: '#FEE2E2' };
    case 'low_stock': return { label: 'Low Stock', bgColor: '#FEF3C7' };
    case 'planogram_violation': return { label: 'Planogram Violation', bgColor: '#E0E7FF' };
    default: return { label: 'Alert', bgColor: '#F3F4F6' };
  }
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ critical: 0, high: 0, medium: 0, low: 0, total_revenue: 0 });
  const [tabValue, setTabValue] = useState(0);
  const [socket, setSocket] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(true);

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts/active');
      setAlerts(response.data);
      const statsResponse = await api.get('/alerts/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all alerts (history)
  const fetchAllAlerts = async () => {
    try {
      const response = await api.get('/alerts/all');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch all alerts:', error);
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}`, { status: 'resolved' });
      fetchAlerts();
      setSnackbar({ open: true, message: 'Alert resolved!', severity: 'success' });
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    fetchAlerts();

    const token = localStorage.getItem('access_token');
    const wsUrl = `${process.env.REACT_APP_WS_URL?.replace('http', 'ws') || 'ws://localhost:8000'}/alerts/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_alert') {
        setAlerts(prev => [data.data, ...prev]);
        setSnackbar({ 
          open: true, 
          message: `New ${data.data.priority} alert: ${data.data.title}`, 
          severity: data.data.priority === 'critical' ? 'error' : 'warning' 
        });
        fetchAlerts(); // Refresh stats
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    setSocket(ws);
    
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      fetchAlerts();
    } else {
      fetchAllAlerts();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredAlerts = alerts.filter(alert => {
    if (tabValue === 0) return alert.status === 'active';
    return true;
  });

  const criticalAlerts = filteredAlerts.filter(a => a.priority === 'critical').length;

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1F2937' }}>
            🔔 Alert Center
          </Typography>
          <Badge badgeContent={stats.critical} color="error">
            <NotificationsIcon sx={{ fontSize: 32, color: '#6B7280' }} />
          </Badge>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ bgcolor: '#EF4444', color: 'white', minWidth: 120 }}>
            <CardContent>
              <Typography variant="h4">{stats.critical}</Typography>
              <Typography variant="body2">Critical</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#F97316', color: 'white', minWidth: 120 }}>
            <CardContent>
              <Typography variant="h4">{stats.high}</Typography>
              <Typography variant="body2">High</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#F59E0B', color: 'white', minWidth: 120 }}>
            <CardContent>
              <Typography variant="h4">{stats.medium}</Typography>
              <Typography variant="body2">Medium</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#10B981', color: 'white', minWidth: 120 }}>
            <CardContent>
              <Typography variant="h4">{stats.low}</Typography>
              <Typography variant="body2">Low</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#2563EB', color: 'white', minWidth: 180 }}>
            <CardContent>
              <Typography variant="h5">${stats.total_revenue}</Typography>
              <Typography variant="body2">Revenue at Risk</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label={`Active Alerts (${alerts.filter(a => a.status === 'active').length})`} />
          <Tab label="Alert History" />
        </Tabs>

        {/* Alerts List */}
        {loading ? (
          <Typography>Loading alerts...</Typography>
        ) : filteredAlerts.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#10B981', mb: 2 }} />
            <Typography variant="h6">No Alerts</Typography>
            <Typography color="textSecondary">All shelves are in good condition!</Typography>
          </Card>
        ) : (
          filteredAlerts.map((alert) => {
            const priorityConfig = getPriorityConfig(alert.priority);
            const typeConfig = getTypeConfig(alert.type);
            
            return (
              <Card key={alert.id} sx={{ mb: 2, borderLeft: `4px solid ${priorityConfig.color}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      {priorityConfig.icon}
                      <Chip 
                        label={priorityConfig.label} 
                        size="small" 
                        sx={{ bgcolor: priorityConfig.color, color: 'white' }}
                      />
                      <Chip 
                        label={typeConfig.label} 
                        size="small" 
                        sx={{ bgcolor: typeConfig.bgColor }}
                      />
                      {alert.status !== 'active' && (
                        <Chip label="Resolved" size="small" sx={{ bgcolor: '#D1D5DB' }} />
                      )}
                    </Box>
                    {alert.status === 'active' && (
                      <IconButton onClick={() => resolveAlert(alert.id)} size="small">
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Typography variant="h6">{alert.title}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {alert.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    <Typography variant="caption" sx={{ bgcolor: '#F3F4F6', p: 0.5, px: 1, borderRadius: 1 }}>
                      📍 {alert.location}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: '#F3F4F6', p: 0.5, px: 1, borderRadius: 1 }}>
                      🏷️ {alert.product_sku}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: '#FEE2E2', p: 0.5, px: 1, borderRadius: 1 }}>
                      💰 ${alert.revenue_impact} at risk
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      🕐 {new Date(alert.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Snackbar for notifications */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AlertsPage;