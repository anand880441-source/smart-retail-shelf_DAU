import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Tabs, Tab, 
  Badge, CircularProgress, Paper, Alert as MuiAlert, 
  Snackbar, Button, useTheme, useMediaQuery
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AlertCard from '../components/common/Cards/AlertCard';
import MetricCard from '../components/common/Cards/MetricCard';
import { useAlerts } from '../context/AlertContext';
import { WS_URL } from '../utils/constants';
import websocketService from '../services/websocketService';
import { alertService } from '../services/api';

const AlertsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { alerts, stats, loading, fetchAlerts, resolveAlert } = useAlerts();
  const [tabValue, setTabValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const wsUrl = `${WS_URL}/ws/alerts`;
    websocketService.connect(wsUrl);

    const handleNewAlert = (data) => {
      if (data.type === 'new_alert') {
        fetchAlerts();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
      <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 1, 
              letterSpacing: '-0.03em',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Alert Center
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
            Manage real-time shelf-intelligence and stock notifications.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            fullWidth={isMobile}
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchAlerts}
            sx={{ borderRadius: '12px', borderColor: 'rgba(255,255,255,0.1)', py: 1 }}
          >
            Refresh
          </Button>
          <Badge 
            badgeContent={activeAlertsCount} 
            color="primary"
            sx={{ '& .MuiBadge-badge': { fontWeight: 800, height: 24, minWidth: 24, borderRadius: 12 } }}
          >
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: 'rgba(99, 102, 241, 0.1)', 
                color: 'primary.main',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <NotificationsIcon />
            </Box>
          </Badge>
        </Box>
      </Box>

      {/* Stats Summary - Refined Grid for all screens */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
          <MetricCard title="Critical" value={stats?.critical || 0} color="#EF4444" trend="Alert" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
          <MetricCard title="High" value={stats?.high || 0} color="#F97316" trend="Action" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
          <MetricCard title="Medium" value={stats?.medium || 0} color="#F59E0B" trend="Monitor" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
          <MetricCard title="Low" value={stats?.low || 0} color="#10B981" trend="Stable" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
          <MetricCard 
            title="Risk Value" 
            value={`$${stats?.total_revenue?.toLocaleString() || 0}`} 
            color="#6366F1"
            subtitle="Potential Daily"
            trend="Economic"
          />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.05)', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ 
            '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem', px: { xs: 2, sm: 4 } },
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab icon={<NotificationsIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label={`Active (${activeAlertsCount})`} />
          <Tab icon={<HistoryIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="History" />
        </Tabs>
      </Box>

      <Box sx={{ minHeight: '40vh' }}>
        <AnimatePresence mode="wait">
          {tabValue === 0 && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                  <CircularProgress thickness={5} />
                </Box>
              ) : alerts.length === 0 ? (
                <Paper 
                  sx={{ 
                    p: { xs: 4, md: 10 }, 
                    textAlign: 'center', 
                    borderRadius: '24px',
                    background: 'rgba(30, 41, 59, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      p: { xs: 2, md: 3 }, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(16, 185, 129, 0.1)', 
                      color: 'success.main', 
                      mb: 3 
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>All Systems Clear</Typography>
                  <Typography sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto', fontSize: '0.9rem' }}>
                    No active inventory or shelf alerts at the moment. All categories are operating within compliance.
                  </Typography>
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
            </motion.div>
          )}

          {tabValue === 1 && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {historyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                  <CircularProgress thickness={5} />
                </Box>
              ) : history.length === 0 ? (
                <Paper 
                  sx={{ 
                    p: { xs: 4, md: 10 }, 
                    textAlign: 'center', 
                    borderRadius: '24px',
                    background: 'rgba(30, 41, 59, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>No Resolution History</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>Resolved alerts will populate this archive for your review.</Typography>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%', 
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            fontWeight: 700
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AlertsPage;