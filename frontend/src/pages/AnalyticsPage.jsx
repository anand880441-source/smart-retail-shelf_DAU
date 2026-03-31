import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, CircularProgress, 
  Alert, LinearProgress, useTheme, useMediaQuery
} from '@mui/material';
import { 
  Warning as WarningIcon, 
  CheckCircle as CheckCircleIcon, 
  Speed as SpeedIcon, 
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import MetricCard from '../components/common/Cards/MetricCard';
import BarChart from '../components/common/Charts/BarChart';
import LineChart from '../components/common/Charts/LineChart';
import { analyticsService } from '../services/api';

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#6366F1'];

const AnalyticsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [dashRes, forecastRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getForecasts()
        ]);
        setData(dashRes.data);
        setForecast(forecastRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Could not load analytics data. Using simulation data.');
        setData({
          total_alerts: 145,
          resolution_rate: 85,
          avg_response_time: 24,
          alert_stats: [
            { _id: 'critical', count: 15, revenue: 1200 },
            { _id: 'warning', count: 45, revenue: 800 },
            { _id: 'info', count: 85, revenue: 0 }
          ],
          type_distribution: [
            { _id: 'stockout', count: 80 },
            { _id: 'misplacement', count: 40 },
            { _id: 'compliance', count: 25 }
          ],
          trend_data: [
            { _id: '2024-03-24', count: 12 },
            { _id: '2024-03-25', count: 18 },
            { _id: '2024-03-26', count: 15 },
            { _id: '2024-03-27', count: 22 },
            { _id: '2024-03-28', count: 20 },
            { _id: '2024-03-29', count: 25 },
            { _id: '2024-03-30', count: 19 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  const priorityData = data?.alert_stats?.map(stat => ({
    name: stat._id?.toUpperCase() || 'Unknown',
    value: stat.count
  })) || [];

  const trendData = data?.trend_data?.map(item => ({
    date: item._id,
    alerts: item.count
  })) || [];

  const typeData = data?.type_distribution?.map(type => ({
    name: type._id?.replace('_', ' ').toUpperCase() || 'Unknown',
    value: type.count
  })) || [];

  const stockCategories = [
    { name: 'Dairy', value: 95, color: '#10B981' },
    { name: 'Bakery', value: 90, color: '#6366F1' },
    { name: 'Meat', value: 85, color: '#F59E0B' },
    { name: 'Produce', value: 80, color: '#EF4444' }
  ];

  const glassPanel = {
    borderRadius: '24px',
    overflow: 'hidden',
    background: 'rgba(30, 41, 59, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    p: { xs: 2.5, md: 3 },
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
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
          Store Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Deep dive into your store performance and alert trends.
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="warning" 
          variant="outlined"
          sx={{ mb: 4, borderRadius: '16px', bgcolor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}
        >
          {error}
        </Alert>
      )}

      {/* KPI Cards Grid with better scaling */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard title="Total Alerts" value={data?.total_alerts || 0} icon={<WarningIcon sx={{ fontSize: 24 }} />} color="#EF4444" trend="7 days" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard title="Resolution Rate" value={`${data?.resolution_rate || 0}%`} icon={<CheckCircleIcon sx={{ fontSize: 24 }} />} color="#10B981" subtitle="Closed within 24h" trend="On Track" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard title="Avg Response" value={`${data?.avg_response_time || 0}m`} icon={<SpeedIcon sx={{ fontSize: 24 }} />} color="#F59E0B" subtitle="Time to acknowledge" trend="Improving" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} component={motion.div} variants={itemVariants}>
          <MetricCard title="Revenue Saved" value={`$${data?.alert_stats?.reduce((sum, s) => sum + (s.revenue || 0), 0).toLocaleString() || 0}`} icon={<MoneyIcon sx={{ fontSize: 24 }} />} color="#6366F1" subtitle="From resolved stockouts" trend="Growing" />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Alert Trends</Typography>
            <LineChart data={trendData} dataKey="alerts" xAxisKey="date" stroke="#EF4444" />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Priority Split</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#F9FAFB',
                      fontWeight: 600
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ color: '#9CA3AF', fontWeight: 500, fontSize: '0.85rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Alerts by Type</Typography>
            <BarChart data={typeData} dataKey="value" xAxisKey="name" fill="#6366F1" />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Stock Availability</Typography>
            <Box sx={{ mt: 1 }}>
              {stockCategories.map((cat) => (
                <Box key={cat.name} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{cat.name}</Typography>
                    <Typography variant="body2" sx={{ color: cat.color, fontWeight: 700 }}>{cat.value}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={cat.value} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      bgcolor: 'rgba(255,255,255,0.04)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${cat.color}90, ${cat.color})`,
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Forecast Section Refined */}
      {forecast && (
        <Paper sx={{ ...glassPanel, mb: 3 }} component={motion.div} variants={itemVariants}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            📈 Demand Forecasting
          </Typography>
          <Box sx={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.next_7_days?.dates?.map((date, i) => ({
                date,
                forecast: forecast.next_7_days.forecast[i],
                upper: forecast.next_7_days.upper[i],
                lower: forecast.next_7_days.lower[i]
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                <Area type="monotone" dataKey="forecast" stroke="#6366F1" fill="rgba(99, 102, 241, 0.1)" strokeWidth={3} />
                <Area type="monotone" dataKey="upper" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.05)" opacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AnalyticsPage;