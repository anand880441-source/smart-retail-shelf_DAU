import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#2563EB'];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchForecast();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await api.get('/analytics/forecast');
      setForecast(response.data);
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare pie chart data
  const priorityData = data?.alert_stats?.map(stat => ({
    name: stat._id?.toUpperCase() || 'Unknown',
    value: stat.count,
    revenue: stat.revenue
  })) || [];

  const typeData = data?.type_distribution?.map(type => ({
    name: type._id?.replace('_', ' ').toUpperCase() || 'Unknown',
    value: type.count
  })) || [];

  // Prepare trend data for chart
  const trendData = data?.trend_data?.map(item => ({
    date: item._id,
    alerts: item.count
  })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1F2937', mb: 3 }}>
          📊 Analytics Dashboard
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ color: '#EF4444', mr: 1 }} />
                  <Typography color="textSecondary">Total Alerts</Typography>
                </Box>
                <Typography variant="h3">{data?.total_alerts || 0}</Typography>
                <Typography variant="body2" color="textSecondary">
                  All time alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography color="textSecondary">Resolution Rate</Typography>
                </Box>
                <Typography variant="h3">{data?.resolution_rate || 0}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={data?.resolution_rate || 0} 
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon sx={{ color: '#F59E0B', mr: 1 }} />
                  <Typography color="textSecondary">Avg Response Time</Typography>
                </Box>
                <Typography variant="h3">{data?.avg_response_time || 0} min</Typography>
                <Typography variant="body2" color="textSecondary">
                  Time to resolve
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MoneyIcon sx={{ color: '#2563EB', mr: 1 }} />
                  <Typography color="textSecondary">Revenue Saved</Typography>
                </Box>
                <Typography variant="h3">
                  ${data?.alert_stats?.reduce((sum, s) => sum + (s.revenue || 0), 0) || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  From resolved alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Alert Trends (Last 7 Days)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Alerts by Priority</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Alerts by Type</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top Products with Most Alerts</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.top_products || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="_id" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Forecast Section */}
        {forecast && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📈 Demand Forecast (Next 7 Days)
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
                <Area type="monotone" dataKey="upper" stroke="#F59E0B" fill="#FEF3C7" />
                <Area type="monotone" dataKey="forecast" stroke="#2563EB" fill="#DBEAFE" />
                <Area type="monotone" dataKey="lower" stroke="#10B981" fill="#D1FAE5" />
              </AreaChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Chip label="🔵 Forecast" sx={{ bgcolor: '#DBEAFE' }} />
              <Chip label="🟡 Upper Bound (90th percentile)" sx={{ bgcolor: '#FEF3C7' }} />
              <Chip label="🟢 Lower Bound (10th percentile)" sx={{ bgcolor: '#D1FAE5' }} />
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default AnalyticsPage;