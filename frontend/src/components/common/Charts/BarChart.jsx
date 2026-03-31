import React from 'react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme, Box } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box 
        sx={{ 
          bgcolor: 'rgba(17, 24, 39, 0.8)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 1.5, 
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >
        <Box sx={{ fontWeight: 800, mb: 0.5, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>
          {label}
        </Box>
        <Box sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1rem' }}>
          {payload[0].value.toLocaleString()}
        </Box>
      </Box>
    );
  }
  return null;
};

const BarChart = ({ data, dataKey, xAxisKey, fill = '#6366F1' }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey={xAxisKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 500 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 500 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar 
          dataKey={dataKey} 
          fill={fill} 
          radius={[6, 6, 0, 0]} 
          barSize={32}
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;