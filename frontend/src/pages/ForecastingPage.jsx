import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../services/api';

const ForecastingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState('MILK001');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const products = [
    { sku: 'MILK001', name: 'Milk 1L' },
    { sku: 'BRD004', name: 'White Bread' },
    { sku: 'EGG013', name: 'Eggs Dozen' }
  ];

  useEffect(() => {
    fetchForecast();
  }, [selectedProduct]);

  const fetchForecast = async () => {
    setLoading(true);
    const response = await api.get(`/forecasting/demand?product_sku=${selectedProduct}&days=30`);
    setForecast(response.data);
    setLoading(false);
  };

  if (loading) return <CircularProgress />;

  const chartData = forecast?.dates?.map((date, i) => ({
    date: date.slice(5),
    forecast: forecast.forecast[i],
    upper: forecast.upper_bound[i],
    lower: forecast.lower_bound[i]
  })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>📈 Demand Forecasting</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>Product</InputLabel>
                  <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} label="Product">
                    {products.map(p => <MenuItem key={p.sku} value={p.sku}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>30-Day Demand Forecast</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ForecastingPage;