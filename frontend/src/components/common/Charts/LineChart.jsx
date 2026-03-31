import React from 'react';
import { 
  LineChart as ReLineChart, Line, XAxis, YAxis, 
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
        <Box sx={{ color: payload[0].color || 'primary.main', fontWeight: 700, fontSize: '1rem' }}>
          {payload[0].value.toLocaleString()}
        </Box>
      </Box>
    );
  }
  return null;
};

const LineChart = ({ data, dataKey, xAxisKey, stroke = '#6366F1', strokeWidth = 3 }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={stroke} stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={stroke} 
          strokeWidth={strokeWidth} 
          dot={{ r: 4, fill: stroke, strokeWidth: 2, stroke: '#111827' }}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', shadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}
          animationDuration={1500}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;