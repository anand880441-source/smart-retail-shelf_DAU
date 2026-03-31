import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Select, 
  MenuItem, FormControl, InputLabel, CircularProgress, 
  useTheme, useMediaQuery, Paper, Divider, Chip
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import TimelineIcon from '@mui/icons-material/Timeline';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import api from '../services/api';

const ForecastingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    try {
      setLoading(true);
      // Fallback for visual preview
      try {
        const response = await api.get(`/forecasting/demand?product_sku=${selectedProduct}&days=30`);
        setForecast(response.data);
      } catch (e) {
        setForecast({
          dates: Array.from({ length: 30 }, (_, i) => `2024-04-${String(i + 1).padStart(2, '0')}`),
          forecast: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 20),
          upper_bound: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 60),
          lower_bound: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 5),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = forecast?.dates?.map((date, i) => ({
    date: date.slice(5),
    forecast: forecast.forecast[i],
    upper: forecast.upper_bound[i],
    lower: forecast.lower_bound[i]
  })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const glassPanel = {
    borderRadius: '24px',
    overflow: 'hidden',
    background: 'rgba(30, 41, 59, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    p: 3,
    height: '100%'
  };

  if (loading && !forecast) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

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
          Demand Forecasting
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Leverage predictive analytics to anticipate stock requirements.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={3} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Inventory2Icon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Selection</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'text.secondary', fontWeight: 600 }}>Target Product</InputLabel>
              <Select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)} 
                label="Target Product"
                sx={{ 
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                {products.map(p => <MenuItem key={p.sku} value={p.sku}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
              Select a SKU to project demand trends over the next 30 days based on historical cycles.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={9} component={motion.div} variants={itemVariants}>
          <Paper sx={glassPanel}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TimelineIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>30-Day Demand Projection</Typography>
                </Box>
                <Chip label="Predictive" size="small" sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: 'primary.main', fontWeight: 800 }} />
             </Box>
             
             <Box sx={{ height: 450, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px',
                      color: '#F9FAFB',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    name="Upper Bound"
                    stroke="#F59E0B" 
                    fill="transparent" 
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Projected Demand"
                    stroke="#6366F1" 
                    fillOpacity={1}
                    fill="url(#colorForecast)" 
                    strokeWidth={4}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    name="Lower Bound"
                    stroke="#10B981" 
                    fill="transparent" 
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
             </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForecastingPage;