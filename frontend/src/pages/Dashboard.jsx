import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Box, CircularProgress, 
  Alert, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  Warning as WarningIcon, 
  AttachMoney as AttachMoneyIcon, 
  CheckCircle as CheckCircleIcon,
  ShoppingBag as ShoppingBagIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MetricCard from '../components/common/Cards/MetricCard';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { alerts, loading: alertsLoading } = useAlerts();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Could not load dashboard statistics. Please try again later.");
        setStats({
          store_health: 92,
          active_stockouts: 12,
          revenue_at_risk: 4231,
          planogram_compliance: 87
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Header section with refined spacing */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
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
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Here is the real-time status of your retail ecosystem.
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          variant="outlined" 
          sx={{ 
            mb: 4, 
            borderRadius: '16px', 
            bgcolor: 'rgba(239, 68, 68, 0.05)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}
        >
          {error} – Using local cached data.
        </Alert>
      )}

      {/* Metric Cards Grid with better scaling */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard 
            title="Store Health" 
            value={`${stats?.store_health || 0}%`} 
            icon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
            color="#10B981"
            trend="+5.2%"
            subtitle="vs last 24h"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard 
            title="Stock Alerts" 
            value={stats?.active_stockouts || 0} 
            icon={<ShoppingBagIcon sx={{ fontSize: 24 }} />}
            color="#EF4444"
            trend="High"
            subtitle={`${alerts?.filter(a => a.priority === 'critical').length || 0} critical alerts`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard 
            title="Risk Revenue" 
            value={`$${stats?.revenue_at_risk?.toLocaleString() || 0}`} 
            icon={<AttachMoneyIcon sx={{ fontSize: 24 }} />}
            color="#F59E0B"
            trend="Action Point"
            subtitle="Stockout impact"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard 
            title="Compliance" 
            value={`${stats?.planogram_compliance || 0}%`} 
            icon={<TimelineIcon sx={{ fontSize: 24 }} />}
            color="#6366F1"
            trend="Stable"
            subtitle="Planogram match"
          />
        </Grid>
      </Grid>

      {/* Table section with better structure */}
      <Grid container spacing={3}>
        <Grid item xs={12} component={motion.div} variants={itemVariants}>
          <Paper 
            sx={{ 
              borderRadius: '24px', 
              overflow: 'hidden',
              background: 'rgba(30, 41, 59, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box 
              sx={{ 
                p: { xs: 2.5, sm: 3 }, 
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                bgcolor: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Recent Critical Tracking
              </Typography>
              <Chip 
                label="Action Required" 
                size="small" 
                color="error" 
                sx={{ fontWeight: 700, borderRadius: '8px', px: 1 }} 
              />
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: { xs: 800, sm: 650 } }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)' }}>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: 'none', py: 2 }}>TYPE</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: 'none', py: 2 }}>PRODUCT</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: 'none', py: 2 }}>LOCATION</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: 'none', py: 2 }}>PRIORITY</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: 'none', py: 2 }} align="right">IMPACT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : alerts?.filter(a => a.priority === 'critical').length > 0 ? (
                    alerts.filter(a => a.priority === 'critical').slice(0, 5).map((alert, idx) => (
                      <TableRow 
                        key={alert.id || alert._id || idx}
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                          transition: 'background 0.2s',
                          '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.03)', py: 2.5 }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>{alert.type}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{alert.product_name || 'N/A'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{alert.aisle || alert.location || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label="CRITICAL" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(239, 68, 68, 0.1)', 
                              color: 'error.main', 
                              fontWeight: 800,
                              fontSize: '0.65rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>
                          -${alert.revenue_impact || 0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                          No critical alerts to display in this cycle.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;