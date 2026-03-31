import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Box, CircularProgress, 
  Alert, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  Warning as WarningIcon, 
  AttachMoney as AttachMoneyIcon, 
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import MetricCard from '../components/common/Cards/MetricCard';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';

const Dashboard = () => {
  const { user } = useAuth();
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
        // Fallback to mock data if API fails during development
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

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is what's happening at your store today.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard 
            title="Store Health" 
            value={`${stats?.store_health || 0}%`} 
            icon={<CheckCircleIcon />}
            color="#10B981"
            subtitle="↑ 5% from last week"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard 
            title="Active Stockouts" 
            value={stats?.active_stockouts || 0} 
            icon={<WarningIcon />}
            color="#EF4444"
            subtitle={`${alerts?.filter(a => a.priority === 'critical').length || 0} Critical alerts`}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard 
            title="Revenue at Risk" 
            value={`$${stats?.revenue_at_risk?.toLocaleString() || 0}`} 
            icon={<AttachMoneyIcon />}
            color="#F59E0B"
            subtitle="Potential daily loss"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard 
            title="Compliance" 
            value={`${stats?.planogram_compliance || 0}%`} 
            icon={<TrendingUpIcon />}
            color="#2563EB"
            subtitle="Planogram adherence"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Critical Alerts</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Alert</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Aisle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertsLoading ? (
                    <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                  ) : alerts?.filter(a => a.priority === 'critical').length > 0 ? (
                    alerts.filter(a => a.priority === 'critical').slice(0, 5).map((alert, idx) => (
                      <TableRow key={alert.id || alert._id || idx}>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.product_name || 'N/A'}</TableCell>
                        <TableCell>{alert.aisle || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label={alert.priority} color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>
                          -${alert.revenue_impact || 0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No critical alerts at the moment.</Typography>
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