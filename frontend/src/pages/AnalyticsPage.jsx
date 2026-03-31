import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, CircularProgress, 
  Alert, LinearProgress 
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
import MetricCard from '../components/common/Cards/MetricCard';
import BarChart from '../components/common/Charts/BarChart';
import LineChart from '../components/common/Charts/LineChart';
import { analyticsService } from '../services/api';

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#2563EB'];

const AnalyticsPage = () => {
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
        // Simulation data if API fails
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

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare chart data
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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Store Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deep dive into your store performance and alert trends.
        </Typography>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Alerts" 
            value={data?.total_alerts || 0} 
            icon={<WarningIcon />}
            color="#EF4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Resolution Rate" 
            value={`${data?.resolution_rate || 0}%`} 
            icon={<CheckCircleIcon />}
            color="#10B981"
            subtitle="Closed within 24h"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Avg Response" 
            value={`${data?.avg_response_time || 0}m`} 
            icon={<SpeedIcon />}
            color="#F59E0B"
            subtitle="Time to acknowledge"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Revenue Saved" 
            value={`$${data?.alert_stats?.reduce((sum, s) => sum + (s.revenue || 0), 0).toLocaleString() || 0}`} 
            icon={<MoneyIcon />}
            color="#2563EB"
            subtitle="From resolved stockouts"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Alert Trends (Last 7 Days)</Typography>
            <LineChart data={trendData} dataKey="alerts" xAxisKey="date" stroke="#EF4444" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Priority Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Alerts by Type</Typography>
            <BarChart data={typeData} dataKey="value" xAxisKey="name" fill="#2563EB" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Stock Availability</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              {['Dairy', 'Bakery', 'Meat', 'Produce'].map((cat, idx) => (
                <Box key={cat} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{cat}</Typography>
                    <Typography variant="body2" color="text.secondary">{95 - (idx * 5)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={95 - (idx * 5)} 
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100' }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Forecast Section */}
      {forecast && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            📈 Demand Forecasting
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecast.next_7_days?.dates?.map((date, i) => ({
              date,
              forecast: forecast.next_7_days.forecast[i],
              upper: forecast.next_7_days.upper[i],
              lower: forecast.next_7_days.lower[i]
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="forecast" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} />
              <Area type="monotone" dataKey="upper" stroke="#F59E0B" fill="#FEF3C7" opacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AnalyticsPage;